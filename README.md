PulseHR

Full-stack employee leave management system to handle leave requests, approvals, and leave balances with role-based access.

Overview

PulseHR lets employees apply for leave, while managers and HR review, approve, or reject requests. The system tracks leave balances and enforces workflow rules.

Tech Stack

Frontend React
Backend Node.js, Express.js
Database PostgreSQL
Authentication JWT, bcrypt
Deployment Docker support

Core Features

• Leave application submission and validation
• Role-based access for employee, manager, HR
• Approve or reject leave requests with comments
• Automatic leave balance update
• Secure login with hashed passwords
• REST APIs with PostgreSQL integration

System Flow

Employee login → Apply leave → Manager/HR review → Approve/Reject → Balance update

Setup

Clone repository
```bash
git clone https://github.com/krishfr/PulseHR.git
cd PulseHR
```

Install frontend dependencies
```bash
cd client
npm install
```

Install backend dependencies
```bash
cd ../server
npm install
```

Environment variables
```bash
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_key
```

Run locally
```bash
docker-compose up
```

Access Application
```bash
http://localhost:3000
```

Use Cases

• HR leave tracking and automation
• Manager leave approvals
• Employee self-service for leave requests
• Small to midsize company HR tool

Future Enhancements

• Email notifications on leave status
• Leave analytics dashboard
• Multi-tenant support

Author

Krish Chaudhari
