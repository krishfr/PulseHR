import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import pool from './db.js';


// sync leave_id sequence to avoid duplicate key errors
(async () => {
  try {
    await pool.query(
      `SELECT setval('leave_requests_leave_id_seq', COALESCE((SELECT MAX(leave_id) FROM leave_requests), 0))`
    );
    console.log('leave_id sequence synced');
  } catch (e) {
    console.error('Failed to sync leave_id sequence', e.stack || e);
  }
})();


const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pulsehr_secret';

// Middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};


const allowRoles = (roles) => (req, res, next) => {
  const role = req.user.role.toLowerCase().trim();

  if (!roles.includes(role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};



// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Database connection failed");
  }
});

// ========== EMPLOYEE ENDPOINTS ==========

// Add employee details
app.post('/api/employees', async (req, res) => {
  const { name, email, password, role, dept_id } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO employees (name, email, password, role, dept_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING emp_id, name, email, role`,
      [name, email, hashedPassword, role, dept_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Employee creation failed' });
  }
});


// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sorry, failed to get details of employees");
  }
});

// Get employee details by id
app.get('/api/employees/:emp_id', async (req, res) => {
  const { emp_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM employees WHERE emp_id = $1", [emp_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Fetching data from employees failed");
  }
});

// Update employee leave type
app.put('/api/employees/:emp_id/leave', async (req, res) => {
  const { emp_id } = req.params;
  const { leave_type_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE employees SET leave_type_id=$1 WHERE emp_id=$2 RETURNING *",
      [leave_type_id, emp_id]
    );
    res.json({ message: "Employee leave type updated", employees: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Failed to change leave type");
  }
});

// ========== LEAVE TYPE ENDPOINTS ==========

// LOGIN (email-based)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT emp_id, name, email, password, role FROM employees WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { emp_id: user.emp_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        emp_id: user.emp_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});


// GET LEAVE BALANCE (EMPLOYEE)
app.get(
  '/leave-balance',
  verifyJWT,
  allowRoles(['employee', 'developer']),
  async (req, res) => {
    try {
      const emp_id = req.user.emp_id;

      const result = await pool.query(
        `
        SELECT total_leaves, used_leaves,
               (total_leaves - used_leaves) AS remaining_leaves
        FROM employees
        WHERE emp_id = $1
        `,
        [emp_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error('BALANCE ERROR', err);
      res.status(500).json({ message: err.message });
    }
  }
);



// Add employee leave types
// DEBUG /apply (paste over your current /apply handler)
app.post(
  '/apply',
  verifyJWT,
  allowRoles(['employee', 'developer']),
  async (req, res) => {
    try {
      const { leave_type_id, start_date, end_date, remarks } = req.body;
      const emp_id = req.user.emp_id;

       if (!leave_type_id || !start_date || !end_date) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const start = new Date(start_date);
  const end = new Date(end_date);

  const requestedDays =
    Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  if (requestedDays <= 0) {
    return res.status(400).json({ message: 'Invalid date range' });
  }

  const bal = await pool.query(
    'SELECT total_leaves, used_leaves FROM employees WHERE emp_id = $1',
    [emp_id]
  );

  if (bal.rows.length === 0) {
    return res.status(400).json({ message: 'Employee not found' });
  }

  const { total_leaves, used_leaves } = bal.rows[0];
  const remaining = total_leaves - used_leaves;

  if (requestedDays > remaining) {
    return res.status(400).json({
      message: `Insufficient leave balance. Remaining: ${remaining}`
    });
  }

  const q = `
    INSERT INTO leave_requests
    (emp_id, leave_type_id, start_date, end_date, status_id, applied_on, remarks)
    VALUES ($1, $2, $3, $4, 1, NOW(), $5)
    RETURNING *;
  `;

  const result = await pool.query(q, [
    emp_id,
    leave_type_id,
    start_date,
    end_date,
    remarks || null
  ]);

  res.json({ success: true, leave: result.rows[0] });

} catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
  });





// Get my leaves
// 

// GET MY LEAVES (EMPLOYEE / DEVELOPER)
app.get('/my/:emp_id', async (req, res) => {
  try {
    const { emp_id } = req.params;

    const query = `
      SELECT
        lr.leave_id,
        lt.type_name,
        lr.start_date,
        lr.end_date,
        lr.no_of_days,
        ls.status_name,
        lr.applied_on,
        lr.approved_on,
        lr.remarks,
        a.name AS approved_by_name
      FROM leave_requests lr
      JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
      JOIN leave_status ls ON lr.status_id = ls.status_id
      LEFT JOIN employees a ON lr.approved_by = a.emp_id
      WHERE lr.emp_id = $1
      ORDER BY lr.applied_on DESC
    `;

    const result = await pool.query(query, [emp_id]);

    res.json({
      success: true,
      leaves: result.rows
    });
  } catch (err) {
    console.error('MY LEAVES ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaves'
    });
  }
});


// Get pending leaves (Admin)
app.get(
  '/pending',
  verifyJWT,
  allowRoles(['manager', 'hr']),
  async (req, res) => {
    const result = await pool.query(`
      SELECT
  lr.leave_id,
  e.emp_id,
  e.name AS emp_name,
  lt.type_name AS leave_type_name,
  lr.start_date,
  lr.end_date,
  lr.no_of_days,
  lr.applied_on
FROM leave_requests lr
JOIN employees e ON lr.emp_id = e.emp_id
JOIN leave_types lt ON lr.leave_type_id = lt.leave_type_id
WHERE lr.status_id = 1
ORDER BY lr.applied_on ASC;


    `);

    res.json({ success: true, leaves: result.rows });
  }
);

// GET leave types (FIXES 404)
app.get('/leave-types', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT leave_type_id, type_name FROM leave_types ORDER BY leave_type_id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('LEAVE TYPES ERROR', err.stack);
    res.status(500).json({ success: false, message: err.message });
  }
});


// Approve / Reject Leave by (Admin)
app.put(
  '/update/:leave_id',
  verifyJWT,
  allowRoles(['manager', 'hr']),
  async (req, res) => {
    try {
      const { leave_id } = req.params;
      const { status_id, remarks } = req.body;
      const approved_by = req.user.emp_id;

      // fetch leave
      const leaveRes = await pool.query(
        `SELECT emp_id, start_date, end_date, status_id
         FROM leave_requests
         WHERE leave_id = $1`,
        [leave_id]
      );

      if (leaveRes.rows.length === 0) {
        return res.status(404).json({ message: 'Leave not found' });
      }

      const leave = leaveRes.rows[0];

      // prevent double approval
      if (leave.status_id !== 1) {
        return res.status(400).json({ message: 'Leave already processed' });
      }

      // update leave status
      const updatedLeave = await pool.query(
        `
        UPDATE leave_requests
        SET status_id = $1,
            approved_by = $2,
            approved_on = NOW(),
            remarks = $3
        WHERE leave_id = $4
        RETURNING *
        `,
        [status_id, approved_by, remarks || null, leave_id]
      );

      // ONLY if approved → deduct balance
      if (status_id === 2) {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);

        const approvedDays =
          Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

        await pool.query(
          `
          UPDATE employees
          SET used_leaves = used_leaves + $1
          WHERE emp_id = $2
          `,
          [approvedDays, leave.emp_id]
        );
      }

      res.json({ success: true, leave: updatedLeave.rows[0] });

    } catch (err) {
      console.error('UPDATE ERROR', err);
      res.status(500).json({ message: err.message });
    }
  }
);



// TEMP auth middleware (role-based)
// Role-based access middleware


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
