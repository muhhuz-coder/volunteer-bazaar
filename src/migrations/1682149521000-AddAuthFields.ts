import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthFields1682149521000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add auth fields to users table
        await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
            ADD COLUMN IF NOT EXISTS password VARCHAR(255),
            ADD COLUMN IF NOT EXISTS role ENUM('volunteer', 'organization', 'admin') DEFAULT 'volunteer';
        `);

        // Add status field to organizations table
        await queryRunner.query(`
            ALTER TABLE organizations 
            ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS description TEXT,
            ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255),
            ADD COLUMN IF NOT EXISTS website VARCHAR(255),
            ADD COLUMN IF NOT EXISTS email VARCHAR(255),
            ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
            ADD COLUMN IF NOT EXISTS address TEXT;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove auth fields from users table
        await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN IF EXISTS email,
            DROP COLUMN IF EXISTS password,
            DROP COLUMN IF EXISTS role;
        `);

        // Remove status field from organizations table
        await queryRunner.query(`
            ALTER TABLE organizations 
            DROP COLUMN IF EXISTS status,
            DROP COLUMN IF EXISTS description,
            DROP COLUMN IF EXISTS logo_url,
            DROP COLUMN IF EXISTS website,
            DROP COLUMN IF EXISTS email,
            DROP COLUMN IF EXISTS phone,
            DROP COLUMN IF EXISTS address;
        `);
    }
} 