import express from 'express';
import pool from './db.js';


const app = express();
const PORT = 5000;


app.get('/api/health', async (req,res)=> {
    try{
        const result = await pool.query("SELECT NOW()");
        res.json({status: "ok", time: result.rows[0] });
    }catch(err) {
        console.error(err.message);
        res.status(500).send("Database connection failed");
        
    }
})

app.listen(PORT, ()=>{
    console.log("Server is running...");
}) 