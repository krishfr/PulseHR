import 'dotenv/config'
import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'elms',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 1234),
  max: 10,
  idleTimeoutMillis: 30000
})

// quick test at startup
pool.query('SELECT 1').then(()=>console.log('DB pool connected')).catch(e=>{
  console.error('DB pool connection error', e.stack || e)
  // do not exit, let health check show error
})

export default pool
