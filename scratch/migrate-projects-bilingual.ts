import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Migrating database schema for projects...");

    await client.query(`
      ALTER TABLE dev_shell_portfolio.projects 
      ADD COLUMN IF NOT EXISTS title_en text,
      ADD COLUMN IF NOT EXISTS description_en text,
      ADD COLUMN IF NOT EXISTS challenges_en text,
      ADD COLUMN IF NOT EXISTS solutions_en text,
      ADD COLUMN IF NOT EXISTS business_impact_en text;
    `);

    console.log("Database schema updated successfully for bilingual project fields!");
  } catch (err) {
    console.error("Error running projects migration script:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
