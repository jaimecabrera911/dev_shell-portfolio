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

async function update() {
  const client = await pool.connect();
  try {
    console.log("Updating name to 'JaiCab' in database...");
    
    const res = await client.query(
      `UPDATE dev_shell_portfolio.resume_data 
       SET name = 'JaiCab' 
       WHERE id = 'main'`
    );

    if (res.rowCount === 0) {
      console.error("No 'main' resume row found to update.");
    } else {
      console.log("Updated name to 'JaiCab' successfully in the database!");
    }
  } catch (err) {
    console.error("Error running name update script:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

update();
