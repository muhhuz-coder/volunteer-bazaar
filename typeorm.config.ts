import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'path';

// Load environment variables
config({ path: path.resolve(__dirname, '.env') });

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'volunteer_bazaar',
  entities: [__dirname + '/src/entities/**/*.entity.ts'],
  migrations: [__dirname + '/src/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
}); 