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

const skills = [
  { name: 'JavaScript', icon: 'Javascript', category: 'frontend', isCore: true },
  { name: 'TypeScript', icon: 'Typescript', category: 'frontend', isCore: true },
  { name: 'React.js', icon: 'React', category: 'frontend', isCore: true },
  { name: 'Node.js', icon: 'Node', category: 'backend', isCore: true },
  { name: 'PostgreSQL', icon: 'Postgres', category: 'database', isCore: true },
  { name: 'Docker', icon: 'Docker', category: 'devops', isCore: true },
  { name: 'AWS Cloud', icon: 'Aws', category: 'devops', isCore: true },
  { name: 'Next.js', icon: 'Next', category: 'frontend', isCore: true },
  { name: 'Go', icon: 'Go', category: 'backend', isCore: false },
  { name: 'Redis', icon: 'Redis', category: 'database', isCore: false },
  { name: 'React Native', icon: 'ReactNative', category: 'frontend', isCore: false },
  { name: 'GraphQL', icon: 'Graphql', category: 'backend', isCore: false },
  { name: 'Kubernetes', icon: 'Kubernetes', category: 'devops', isCore: false },
  { name: 'GitHub Actions', icon: 'Github', category: 'devops', isCore: false }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Connecting to database and updating skill ecosystem...");
    
    // Update skills column in main resume row
    const res = await client.query(
      `UPDATE dev_shell_portfolio.resume_data 
       SET skills = $1 
       WHERE id = 'main'`,
      [JSON.stringify(skills)]
    );

    if (res.rowCount === 0) {
      console.error("No 'main' resume row found to update. Run the main seed script first.");
    } else {
      console.log("Updated all 14 skill ecosystem entries successfully in row 'main'!");
    }
  } catch (err) {
    console.error("Error running skills seed script:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
