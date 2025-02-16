import { createReadStream } from 'fs';
import csv from 'csv-parser';
import mysql from 'mysql2';

const dbConfig = {
    host: 'volunteerdbinstance.cv6q86yyyce6.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'As5526as123',
    database: 'volunteer_db',
    port: 3306,
};

const pool = mysql.createPool(dbConfig);

const parseDegree = (degreeStr) => {
    const degreeMap = {
        'Higher Secondary (Intermediate/A levels)': 'Higher Secondary',
        'Bachelors/ BS (16 years)': 'Bachelors',
        'Any of the above': 'Other'
    };
    return degreeMap[degreeStr] || degreeStr;
};

const importVolunteers = async () => {
  let connection;
  try {
    connection = await pool.promise().getConnection();
    console.log('Database connected successfully');

    const volunteers = [];
    
    // Reading CSV data
    await new Promise((resolve, reject) => {
      createReadStream('Volunteers_Data.csv')
        .pipe(csv({ mapHeaders: ({ header }) => header.trim().toLowerCase() }))
        .on('data', (row) => volunteers.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    for (const volunteer of volunteers) {
      // Skipping incomplete records
      if (!volunteer.name || !volunteer.city || !volunteer.field || !volunteer.degree) {
        console.warn(`Skipping incomplete volunteer record:`, volunteer);
        continue;
      }

      const degreeName = parseDegree(volunteer.degree);
      await connection.execute('INSERT IGNORE INTO degrees (degree_name) VALUES (?)', [degreeName]);
      await connection.execute('INSERT IGNORE INTO fields (field_name) VALUES (?)', [volunteer.field]);
      await connection.execute('INSERT IGNORE INTO cities (city_name, province) VALUES (?, ?)', [volunteer.city, volunteer.province || 'Unknown']);

      // Fetching degree, field, and city IDs
      const [[degree]] = await connection.execute('SELECT degree_id FROM degrees WHERE degree_name = ?', [degreeName]) || [{}];
      const [[field]] = await connection.execute('SELECT field_id FROM fields WHERE field_name = ?', [volunteer.field]) || [{}];
      const [[city]] = await connection.execute('SELECT city_id FROM cities WHERE city_name = ?', [volunteer.city]) || [{}];

      // Inserting volunteer data into users table
      const [userResult] = await connection.execute(`
        INSERT INTO users (
            name, gender, age, city_id, province, rating,
            degree_id, field_id, university, employment_status, bio,
            reviews_received, referral_count, hours_completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        volunteer.name, volunteer.gender, parseInt(volunteer.age),
        city?.city_id || null, volunteer.province || 'Unknown',
        parseFloat(volunteer.rating) || 0,
        degree?.degree_id || null, field?.field_id || null,
        volunteer.university || 'Not Specified',
        volunteer['employment status'] || 'Unknown',
        volunteer.bio || 'No bio available',
        parseInt(volunteer['reviews received']) || 0,
        parseInt(volunteer['referral count']) || 0,
        parseInt(volunteer['hours completed']) || 0
      ]);

      const userId = userResult.insertId;

      // Function to insert related data into many-to-many tables
      const insertRelatedData = async (tableName, column, values) => {
        for (const value of values.split(',').map(v => v.trim())) {
            if (!value) continue;
            await connection.execute(`INSERT IGNORE INTO ${tableName} (${column}) VALUES (?)`, [value]);
    
            let columnId = `${tableName.slice(0, -1)}_id`;  // Assuming all tables use this naming convention.
            if (tableName === 'activities') {
                columnId = 'activity_id';  // Fix for the 'activities' table
            }
    
            const [[record]] = await connection.execute(`SELECT ${columnId} FROM ${tableName} WHERE ${column} = ?`, [value]);
            await connection.execute(`INSERT IGNORE INTO user_${tableName} (user_id, ${columnId}) VALUES (?, ?)`, [userId, record[columnId]]);
        }
    };
    
      // Inserting skills, causes, activities, and event types
      if (volunteer.skills) await insertRelatedData('skills', 'skill_name', volunteer.skills);
      if (volunteer['causes interested in']) await insertRelatedData('causes', 'cause_name', volunteer['causes interested in']);
      if (volunteer['activities volunteered']) await insertRelatedData('activities', 'activity_name', volunteer['activities volunteered']);
      if (volunteer['event types']) await insertRelatedData('event_types', 'event_type', volunteer['event types']);
    }

    console.log('Volunteers imported successfully');
  } catch (error) {
    console.error('Error importing volunteers:', error);
  } finally {
    if (connection) connection.release();
  }
};

importVolunteers();
