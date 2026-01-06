# PulseHR – Cloud-based Employee Leave Management System

A modern Employee Leave Management System built with React, Node.js, and PostgreSQL. Features include leave requests, approvals, attendance tracking, and automated workflows.

## Features

- ✅ Employee leave application
- ✅ Admin dashboard for leave approval/rejection
- ✅ View personal leave history
- ✅ Multiple leave types support
- ✅ Real-time status updates
- ✅ Responsive modern UI

## Tech Stack

- **Frontend**: React 19, Axios
- **Backend**: Node.js, Express 5
- **Database**: PostgreSQL
- **Styling**: CSS3 with modern design

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Make sure PostgreSQL is running on your system
2. Create a database named `elms` (or update the database name in `server/db.js`):
   ```sql
   CREATE DATABASE elms;
   ```

3. Run the database schema:
   ```bash
   psql -U postgres -d elms -f server/database_schema.sql
   ```
   Or connect to your database and run the SQL file manually.

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your PostgreSQL password:
   ```
   DB_PASSWORD=your_postgres_password_here
   PORT=5000
   ```

5. Update `server/db.js` if your PostgreSQL configuration is different:
   - Default: `localhost:1234`
   - Database: `elms`
   - User: `postgres`

6. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will open in your browser at `http://localhost:3000`

## Project Structure

```
PulseHR/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── Components/
│       │   ├── ApplyLeave.js
│       │   ├── MyLeaves.js
│       │   ├── AdminDashboard.js
│       │   └── LeaveRequestRow.js
│       ├── App.js
│       └── App.css
├── server/                 # Node.js backend
│   ├── server.js          # Main server file
│   ├── db.js              # Database connection
│   └── database_schema.sql # Database schema
└── README.md
```

## API Endpoints

### Employee Endpoints
- `GET /api/employees` - Get all employees
- `GET /api/employees/:emp_id` - Get employee by ID
- `POST /api/employees` - Create new employee

### Leave Type Endpoints
- `GET /api/leave_types` - Get all leave types
- `GET /leave-types` - Get leave types (for frontend)
- `POST /api/leave_types` - Create new leave type

### Leave Request Endpoints
- `POST /apply` - Apply for leave
- `GET /my/:emp_id` - Get employee's leave history
- `GET /pending` - Get pending leave requests (Admin)
- `PUT /update/:leave_id` - Approve/Reject leave (Admin)

### Health Check
- `GET /api/health` - Check server and database connection

## Default Credentials

After running the schema, you'll have:
- **Admin**: emp_id = 1, email = admin@pulsehr.com
- **Employee**: emp_id = 2, email = john.doe@pulsehr.com

**Note**: In production, passwords should be properly hashed using bcrypt or similar.

## Usage

1. **Apply for Leave**: Navigate to "Apply Leave" tab, fill in the form, and submit
2. **View My Leaves**: Check "My Leaves" tab to see your leave history
3. **Admin Dashboard**: Admins can view pending requests and approve/reject them

## Development

- Frontend runs on port 3000
- Backend runs on port 5000
- Make sure CORS is enabled (already configured)

## Production Build

### Frontend
```bash
cd client
npm run build
```

### Backend
The server is ready for production. Consider:
- Using environment variables for all sensitive data
- Implementing proper authentication (JWT)
- Adding password hashing
- Setting up HTTPS
- Using a process manager like PM2

## Troubleshooting

1. **Database connection error**: Check PostgreSQL is running and credentials in `db.js` and `.env` are correct
2. **Port already in use**: Change PORT in `.env` or kill the process using the port
3. **CORS errors**: Make sure the backend server is running and CORS is enabled

## License

ISC

## Author

PulseHR Development Team
