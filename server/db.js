import 'dotenv/config'
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'elms',
  password: process.env.DB_PASSWORD,
  port: 1234,

})

export default pool;