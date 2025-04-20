import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export async function ensureDbExists() {
  console.log('Ensuring database exists...');
  
  try {
    // Connection to create database if needed
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'huzaifa123',
    });

    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_DATABASE || 'volunteer_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    
    console.log(`Ensured database '${dbName}' exists`);
    
    // Close connection
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('Failed to ensure database exists:', error);
    return false;
  }
} 