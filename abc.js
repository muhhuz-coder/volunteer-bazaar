import { createReadStream } from 'fs';
import csv from 'csv-parser';
import mysql from 'mysql2';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'huzaifa123',
    database: 'volunteer_db',
    port: 3306,
};
//tesst21s23
const pool = mysql.createPool(dbConfig);
//test
const importUserEvents = async () => {
    let connection;
    try {
        connection = await pool.promise().getConnection();
        console.log('Database connected successfully');

        const userEvents = [];
  //hello
        // Reading CSV data
        await new Promise((resolve, reject) => {
            createReadStream('Ground_Truth_Data.csv')
                .pipe(csv({ mapHeaders: ({ header }) => header.trim().toLowerCase() })) // Normalize headers
                .on('data', (row) => userEvents.push(row))
                .on('end', resolve)
                .on('error', reject);
        });

        for (const record of userEvents) {
            const { event_name, volunteers_participated } = record;

            if (!event_name || !volunteers_participated || volunteers_participated === 'No volunteers') {
                console.warn(`Skipping incomplete record:`, record);
                continue;
            }

            // Fetch event_id
            const [[event]] = await connection.execute(
                'SELECT event_id FROM events WHERE title = ?',
                [event_name]
            );

            if (!event) {
                console.warn(`Event not found: ${event_name}, skipping...`);
                continue;
            }

            const eventId = event.event_id;

            // Process multiple user names
            const userNames = volunteers_participated.split(',').map(name => name.trim());

            for (const userName of userNames) {
                if (!userName) continue;

                // Fetch user_id
                const [[user]] = await connection.execute(
                    'SELECT user_id FROM users WHERE name = ?',
                    [userName]
                );

                if (!user) {
                    console.warn(`User not found: ${userName}, skipping...`);
                    continue;
                }

                const userId = user.user_id;

                // Debug Log
                console.log(`Inserting: user_id=${userId}, event_id=${eventId}`);

                // Insert into user_events table (ignoring duplicates)
                await connection.execute(
                    'INSERT IGNORE INTO user_events (user_id, event_id) VALUES (?, ?)',
                    [userId, eventId]
                );
            }
        }

        console.log('User-event data imported successfully!');
    } catch (error) {
        console.error('Error importing user-event data:', error);
    } finally {
        if (connection) connection.release();
    }
};

importUserEvents();
