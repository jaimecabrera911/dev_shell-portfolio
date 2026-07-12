const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_d4HE9aDNJwAK@ep-delicate-silence-a51cyfvc-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM dev_shell_portfolio.resume_data WHERE id = $1', ['main']);
    console.log('Resume Data in DB:', JSON.stringify(res.rows[0], null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
