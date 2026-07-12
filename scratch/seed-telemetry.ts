import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined in .env.local");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

const telemetryStats = [
  {
    id: 'stat-projects',
    label: 'Completed Projects',
    target: 32,
    suffix: '+',
    description: 'SaaS platforms, web integrations, and resilient cloud architectures.',
    iconName: 'Briefcase'
  },
  {
    id: 'stat-experience',
    label: 'Years of Experience',
    target: 7,
    suffix: '+',
    description: 'Design and implementation of distributed systems and microservices.',
    iconName: 'Code2'
  },
  {
    id: 'stat-clients',
    label: 'Companies & Clients',
    target: 15,
    suffix: '+',
    description: 'Consulting and development for startups and established enterprises.',
    iconName: 'Building'
  },
  {
    id: 'stat-throughput',
    label: 'Peak Traffic Load',
    target: 20,
    suffix: 'k+ req/seg',
    description: 'Optimization of API gateways and caching layers for high concurrency.',
    iconName: 'Rocket'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Connecting to database and updating telemetryStats...");
    
    // Ensure table exists
    await client.query(`
      ALTER TABLE dev_shell_portfolio.resume_data 
      ADD COLUMN IF NOT EXISTS telemetry_stats JSONB;
    `);

    // Update row
    const res = await client.query(
      `UPDATE dev_shell_portfolio.resume_data 
       SET telemetry_stats = $1 
       WHERE id = 'main'`,
      [JSON.stringify(telemetryStats)]
    );

    if (res.rowCount === 0) {
      console.log("No 'main' resume row found to update. Seeding a new row...");
      // Let's insert a default row first
      await client.query(`
        INSERT INTO dev_shell_portfolio.resume_data (
          id, name, title, email, base, availability, 
          summary_standard, summary_architect, summary_fullstack, 
          certifications, experience, telemetry_stats, skills
        ) VALUES (
          'main', 'DEV_SHELL', 'Fullstack Developer & Solutions Architect', 
          'hello@devshell.io', 'San Francisco, CA', 'Immediate', 
          'Summary...', 'Summary...', 'Summary...', 
          '[]'::jsonb, '[]'::jsonb, $1, '[]'::jsonb
        )
      `, [JSON.stringify(telemetryStats)]);
      console.log("Seeded successfully!");
    } else {
      console.log("Updated telemetryStats successfully on row 'main'!");
    }
  } catch (err) {
    console.error("Error running script:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
