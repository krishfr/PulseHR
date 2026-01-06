# Quick Setup Guide

Since you already have PostgreSQL set up, follow these steps:

## Step 1: Create Database (if not exists)

Connect to PostgreSQL and create the database:
```sql
CREATE DATABASE elms;
```

## Step 2: Run Database Schema

Run the schema file in your PostgreSQL database:

**Option A: Using psql command line**
```bash
psql -U postgres -d elms -f server/database_schema.sql
```

**Option B: Using pgAdmin or any PostgreSQL client**
1. Open pgAdmin or your PostgreSQL client
2. Connect to your PostgreSQL server
3. Select the `elms` database
4. Open the Query Tool
5. Copy and paste the contents of `server/database_schema.sql`
6. Execute the script

## Step 3: Configure Environment Variables

1. Navigate to the `server` directory
2. Create a `.env` file (copy from example if available, or create manually):
   ```
   DB_PASSWORD=your_postgres_password
   PORT=5000
   ```

3. Update `server/db.js` if your PostgreSQL settings are different:
   - Default port: `1234` (change if your PostgreSQL uses port 5432)
   - Default user: `postgres`
   - Default database: `elms`
   - Default host: `localhost`

## Step 4: Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

## Step 5: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```
Server will run on http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```
App will open in browser at http://localhost:3000

## Verify Database Connection

Once the server is running, test the connection:
```bash
curl http://localhost:5000/api/health
```

Or visit in browser: http://localhost:5000/api/health

## Default Test Data

After running the schema, you'll have:
- **Leave Types**: Sick Leave, Vacation, Personal Leave, Emergency Leave, Maternity Leave, Paternity Leave
- **Leave Statuses**: Pending, Approved, Rejected, Cancelled
- **Sample Admin**: emp_id = 1
- **Sample Employee**: emp_id = 2

## Troubleshooting

**Database Connection Issues:**
- Check PostgreSQL is running: `pg_isready` or check service status
- Verify database name, user, password, and port in `server/db.js`
- Check `.env` file has correct `DB_PASSWORD`

**Port Already in Use:**
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:5000 | xargs kill` (Mac/Linux) or use Task Manager (Windows)

**Module Not Found:**
- Make sure you ran `npm install` in both `server` and `client` directories

