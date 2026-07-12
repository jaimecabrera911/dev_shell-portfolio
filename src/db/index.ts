import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS dev_shell_portfolio;`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS dev_shell_portfolio.resume_data (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        title_en TEXT,
        email TEXT NOT NULL,
        base TEXT NOT NULL,
        availability TEXT NOT NULL,
        availability_en TEXT,
        summary_standard TEXT NOT NULL,
        summary_standard_en TEXT,
        summary_architect TEXT NOT NULL,
        summary_architect_en TEXT,
        summary_fullstack TEXT NOT NULL,
        summary_fullstack_en TEXT,
        certifications JSONB NOT NULL,
        experience JSONB NOT NULL,
        education_degree TEXT,
        education_degree_en TEXT,
        education_school TEXT,
        education_school_en TEXT,
        education_details TEXT,
        education_details_en TEXT,
        education JSONB,
        pdf_base64 TEXT,
        pdf_file_name TEXT,
        hero_subtitle TEXT,
        hero_subtitle_en TEXT,
        workstory_description TEXT,
        workstory_description_en TEXT,
        contact_description TEXT,
        contact_description_en TEXT,
        telemetry_stats JSONB,
        skills JSONB
      );
    `);

    // Migration: add columns that may not exist on older databases
    const migrations = [
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS workstory_description TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS contact_description TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS telemetry_stats JSONB;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS education JSONB;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS skills JSONB;`,
      // Bilingual columns
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS title_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS availability_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS summary_standard_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS summary_architect_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS summary_fullstack_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS education_degree_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS education_school_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS education_details_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS hero_subtitle_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS workstory_description_en TEXT;`,
      `ALTER TABLE dev_shell_portfolio.resume_data ADD COLUMN IF NOT EXISTS contact_description_en TEXT;`,
    ];
    for (const sql of migrations) {
      await client.query(sql);
    }

    // Make old education columns nullable on existing databases
    await client.query(`ALTER TABLE dev_shell_portfolio.resume_data ALTER COLUMN education_degree DROP NOT NULL;`);
    await client.query(`ALTER TABLE dev_shell_portfolio.resume_data ALTER COLUMN education_school DROP NOT NULL;`);
    await client.query(`ALTER TABLE dev_shell_portfolio.resume_data ALTER COLUMN education_details DROP NOT NULL;`);

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dev_shell_portfolio.projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        challenges TEXT NOT NULL,
        solutions TEXT NOT NULL,
        image TEXT NOT NULL,
        tags JSONB NOT NULL,
        year TEXT NOT NULL,
        demo_url TEXT,
        github_url TEXT,
        architecture_nodes JSONB NOT NULL,
        architecture_links JSONB NOT NULL,
        code_snippet TEXT NOT NULL,
        code_language TEXT NOT NULL,
        business_impact TEXT
      );
    `);

    // Create contact_messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dev_shell_portfolio.contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL
      );
    `);
  } finally {
    client.release();
  }
}
