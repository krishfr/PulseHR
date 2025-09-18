import express, { raw } from 'express';
import pool from './db.js';
import e from 'express';


const app = express();
const PORT = 5000;

app.use(express.json());


//Check the connection
app.get('/api/health', async (req,res)=> {
    try{
        const result = await pool.query("SELECT NOW()");
        res.json({status: "ok", time: result.rows[0] });
    }catch(err) {
        console.error(err.message);
        res.status(500).send("Database connection failed");
        
    }
})  

//Add employee details
app.post('/api/employees', async(req,res) => {
    const{ name, email, password, role, dept_id } = req.body;
    try {
        const result = await pool.query("INSERT INTO employees (name,email,password,role,dept_id) VALUES ($1,$2,$3,$4,$5) RETURNING *", [name, email, password, role, dept_id]);
        res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Unable to add employee details, try again...");
    }
})

//Get employees
app.get('/api/employees', async(req,res) => {
    try {
        const result = await pool.query("SELECT *FROM employees");
        res.json(result.rows);
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Sorry, failed to details of employees");
    }
})

//Get employee details by id
app.get('/api/employees/:emp_id', async(req,res) => {
    const{ emp_id } = req.params;
    try {
        const result = await pool.query("SELECT *FROM employees WHERE emp_id = $1", [emp_id]);
        res.json(result.rows[0]);
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Fetching data from employees failed");
    }
})

//Add employee leave types
app.post('/api/leave_types', async(req,res) => {
    const { leave_type_id, type_name, max_days} = req.body;
    try {
        const result = await pool.query("INSERT INTO leave_types (leave_type_id, type_name, max_days) VALUES($1,$2,$3) RETURNING *", [leave_type_id,type_name,max_days]);
        res.json(result.rows);
    } catch(err) {
        console.err(err.message);
        res.status(201).send("Failed to add details...");
    }
})

// Update leave type - put employees
app.put('/api/employees/:emp_id/leave', async(req,res)=>{
    const { emp_id } = req.params;
    const { leave_type_id } = req.body;

    try {
        const result = await pool.query("UPDATE employees SET leave_type_id=$1 WHERE emp_id=$2 RETURNING *", [leave_type_id,emp_id]);
        res.json({message:"Employee leave type updated", employees: result.rows[0]});
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Failed to changed leave type");
    }
}) 

//Get employee leave types
app.get('/api/leave_types', async (req,res)=> {
    try{
        const result = await pool.query("SELECT *FROM leave_types");
        res.json(result.rows);
    }catch(err) {
        console.error(err.message);
        res.status(500).send("Unable to fetch data from employee leave types");
        
    }
})

//Get employee leave types by id
app.get('/api/leave_types/:leave_type_id', async (req,res)=> {
    const { leave_type_id } = req.params;
    try{
        const result = await pool.query("SELECT *FROM leave_types WHERE leave_type_id = $1", [leave_type_id]);
        res.json(result.rows);
    }catch(err) {
        console.error(err.message);
        res.status(500).send("Unable to fetch data from employee leave types");
        
    }
})

app.listen(PORT, ()=>{
    console.log("Server is running...");
}) 