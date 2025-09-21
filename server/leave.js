import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = 5000;

app.use(cors());  
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

//apply for leave
app.post('/apply', async (req, res) => {
  const { emp_id, leave_type_id, start_date, end_date, status_id, remarks } = req.body;
  
  if (!emp_id || !leave_type_id || !start_date || !end_date) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  } 

  try {
    const query = `
      INSERT INTO leave_requests
      (emp_id, leave_type_id, start_date, end_date, status_id, applied_on, remarks)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6)
      RETURNING *`;
    
    // Only 6 values now
    const result = await pool.query(query, [emp_id, leave_type_id, start_date, end_date, status_id, remarks]);
    
    res.json({ success: true, leave: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

//Get my leaves
app.get('/my/:emp_id', async (req, res) => {
  const { emp_id } = req.params;
  try {
    const query = 
      `SELECT lr.leave_id, lt.type_name, lr.start_date, lr.end_date, ls.status_name, lr.applied_on, lr.approved_on, lr.remarks, lr.no_of_days
FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
      JOIN leave_status ls ON lr.status_id = ls.status_id
      WHERE lr.emp_id = $1
      ORDER BY lr.applied_on DESC`;
    const result = await pool.query(query, [emp_id]);
    res.json({ success: true, leaves: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
// Get all leave types
app.get('/leave-types', async (req, res) => {
  try {
    const query = `SELECT leave_type_id, type_name FROM leave_types ORDER BY leave_type_id`;
    const result = await pool.query(query);
    res.json(result.rows); // returns array of leave types
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

//Get pending leaves by (Admin)
//Get pending leaves by (Admin)
app.get('/pending', async (req, res) => {
  try {
    const query = `
      SELECT lr.leave_id,
             e.emp_id,
             e.name AS emp_name,
             lt.leave_type_id,
             lt.type_name,
             lr.start_date,
             lr.end_date,
             lr.applied_on,
             lr.no_of_days
      FROM leave_requests lr
      JOIN employees e ON lr.emp_id = e.emp_id
      JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
      WHERE lr.status_id = 1
      ORDER BY lr.applied_on ASC`;
    
    const result = await pool.query(query);
    res.json({ success: true, leaves: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


//Approve / Reject Leave by (Admin) 
app.put('/update/:leave_id', async (req, res) => {
  const { leave_id } = req.params;
  const { status_id, approved_by, remarks } = req.body; // status_id: 2=Approved,3=Rejected,4=Cancelled
  try {
    const query = `
      UPDATE leave_requests
      SET status_id = $1, approved_by = $2, approved_on = NOW(), remarks = $3
      WHERE leave_id = $4
      RETURNING *`;
    const result = await pool.query(query, [status_id, approved_by, remarks, leave_id]);
    res.json({ success: true, leave: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
