import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg

console.log('DB CONFIG =>', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? 'SET' : 'MISSING',
  database: process.env.DB_NAME
})

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  max: 10,
  idleTimeoutMillis: 30000
})

pool.query('SELECT NOW()')
  .then(() => console.log('DB pool connected'))
  .catch(e => {
    console.error('DB pool connection error', e.stack || e)
  })

export default pool