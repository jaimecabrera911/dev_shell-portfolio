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

const educationItems = [
  {
    id: 'edu-1',
    degree: 'M.S. in Computer Science & Distributed Systems',
    school: 'Stanford University',
    details: 'Focus on distributed ledger scaling, high-performance database design, and machine learning pipeline optimization.'
  },
  {
    id: 'edu-2',
    degree: 'B.S. in Software Engineering & Core Networks',
    school: 'UC Berkeley',
    details: 'Dean\'s List • In-depth systems engineering, advanced compiler designs, and low-latency network communication protocols.'
  },
  {
    id: 'edu-3',
    degree: 'Specialization in Cloud Infrastructure & DevOps',
    school: 'MIT Professional Education',
    details: 'Advanced training in container orchestration, microservice mesh structures, and highly resilient cloud migrations.'
  },
  {
    id: 'edu-4',
    degree: 'AWS Certified Solutions Architect (Professional)',
    school: 'Amazon Web Services (AWS)',
    details: 'Industry-standard certification validating expertise in architecting highly scalable, secure, and resilient enterprise cloud setups.'
  },
  {
    id: 'edu-5',
    degree: 'Advanced Algorithms & Data Structures Specialization',
    school: 'Princeton University',
    details: 'Rigorous academic program focusing on complex graph calculations, dynamic search tree layouts, and memory optimization.'
  },
  {
    id: 'edu-6',
    degree: 'Fullstack Software Development Program',
    school: 'App Academy',
    details: 'Rigorous software development immersive program covering MVC frameworks, database engineering, and modern React patterns.'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Connecting to database and updating academic education credentials...");
    
    // Update education column in main resume row
    const res = await client.query(
      `UPDATE dev_shell_portfolio.resume_data 
       SET education = $1 
       WHERE id = 'main'`,
      [JSON.stringify(educationItems)]
    );

    if (res.rowCount === 0) {
      console.error("No 'main' resume row found to update. Run the main seed script first.");
    } else {
      console.log("Updated 6 education items successfully in row 'main'!");
    }
  } catch (err) {
    console.error("Error running education seed script:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
