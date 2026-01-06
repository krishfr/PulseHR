import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pool from './db.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url)
  next()
})

// health check
app.get('/api/health', async (req, res) => {
  try {
    const r = await pool.query('SELECT NOW() as now')
    return res.json({ status: 'ok', now: r.rows[0].now })
  } catch (err) {
    console.error('HEALTH DB ERROR', err.stack || err)
    return res.status(500).json({ status: 'db-fail', error: err.message })
  }
})

// ---------------------------
// DATE NORMALIZER (corrected)
// ---------------------------
function normalizeToIso(input) {
  if (!input) return null
  const s = String(input).trim()

  // already ISO yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

  const parts = s.split(/[-/]/)
  if (parts.length !== 3) return null

  // case 1: DD-MM-YYYY
  if (parts[2].length === 4) {
    const [d, m, y] = parts
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`
  }

  // case 2: YYYY-DD-MM (malformed)
  if (parts[0].length === 4) {
    const [y, d, m] = parts
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`
  }

  return null
}

// ---------------------------
// APPLY FOR LEAVE
// ---------------------------
app.post('/apply', async (req, res) => {
  console.log('POST /apply body', req.body)

  const { emp_id, leave_type_id, start_date, end_date, status_id, remarks } = req.body

  if (!emp_id || !leave_type_id || !start_date || !end_date) {
    return res.status(400).json({ success: false, message: 'missing required fields' })
  }

  const empIdNum = Number(emp_id)
  const leaveTypeNum = Number(leave_type_id)

  const sd = normalizeToIso(start_date)
  const ed = normalizeToIso(end_date)

  if (!sd || !ed) {
    return res.status(400).json({ success: false, message: 'invalid date format', start_date: sd, end_date: ed })
  }

const start = new Date(start_date);
const end = new Date(end_date);

const requestedDays =
  Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

if (requestedDays <= 0) {
  return res.status(400).json({ message: 'Invalid date range' });
}


  try {
    const text = `
  INSERT INTO leave_requests
  (emp_id, leave_type_id, start_date, end_date, no_of_days, status_id, applied_on, remarks)
VALUES ($1, $2, $3, $4, $5, 1, NOW(), $6)
  RETURNING *
`

const params = [
  emp_id,
  leave_type_id,
  start_date,
  end_date,
  remarks || null
];


    console.log('QUERY', text.replace(/\s+/g,' '), 'PARAMS', params)

    const result = await pool.query(text, params)
    return res.status(201).json({ success: true, leave: result.rows[0] })

  } catch (err) {
    console.error('POST /apply ERROR', err.stack || err)
    return res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
      detail: err.detail,
      constraint: err.constraint
    })
  }
})

// global error
app.use((err, req, res, next) => {
  console.error('UNHANDLED', err.stack || err)
  res.status(500).json({ error: 'unhandled', message: err.message })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
