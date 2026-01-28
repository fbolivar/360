import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/cyberrisk_360',
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to database...');

        const schemaPath = path.join(process.cwd(), 'supabase/migrations/20240127000000_initial_schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying schema...');
        // Split by statement if needed, but simple exec might work for pg driver if no COPY
        await client.query(schemaSql);

        console.log('Schema applied successfully!');
    } catch (err) {
        console.error('Error applying schema:', err);
    } finally {
        await client.end();
    }
}

main();
