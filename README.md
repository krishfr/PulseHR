Title
Employee Leave Management System (ELMS)

About
A full-stack web application to manage employee leave workflows with role-based access. Employees can apply for leaves, managers and HR can review and approve requests, and the system automatically tracks leave balances.

Key Features
• Secure authentication using bcrypt password hashing and JWT
• Role-based access for Employee, Manager, and HR
• Apply leave with date validation and balance checks
• Approve or reject leave requests with remarks
• Automatic leave balance deduction on approval
• RESTful APIs backed by PostgreSQL
• Environment-based configuration using dotenv

Tech Stack
• Frontend: React, JavaScript, HTML, CSS
• Backend: Node.js, Express
• Database: PostgreSQL
• Auth: JWT, bcrypt
• Tools: Git, Postman

Project Structure
• client → React frontend
• server → Express backend and APIs
• database_schema.sql → DB schema

Setup Instructions
• Clone the repository
• Create a .env file using .env.example
• Update database credentials
• Install dependencies in client and server
• Start backend and frontend servers

Demo Credentials
• Uses demo users for testing
• Passwords are securely hashed
