import { Pool } from 'pg';
import dotenv from 'dotenv-safe';

dotenv.config();

const { PG_USER, PG_PASS, PG_NAME, PG_PORT, PG_HOST } = process.env;

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_NAME,
  password: PG_PASS,
  port: PG_PORT,
});

const startDB = async () => {
  await pool.connect();

  try {
    const dateNow = await pool.query('SELECT NOW() as now');
    console.log(`Database connected: ${new Date(dateNow.rows[0].now).toUTCString()}`);
  } catch (error) {
    console.error(error.stack);
  }
};

pool.startDB = startDB;
module.exports = pool;
