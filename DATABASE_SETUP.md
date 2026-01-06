# How to Run Database Schema in PostgreSQL

There are several ways to run the SQL schema file. Choose the method that works best for you:

## Method 1: Using psql Command Line (Recommended)

### Step 1: Open PowerShell or Command Prompt

### Step 2: Navigate to the project directory
```bash
cd "C:\Users\Krish Chaudhari\OneDrive\Desktop\PulseHR\PulseHR"
```

### Step 3: Run the SQL file using psql

**Option A: If PostgreSQL is in your PATH:**
```bash
psql -U postgres -d elms -f server/database_schema.sql
```

**Option B: If you need to specify the full path to psql:**
```bash
"C:\Program Files\PostgreSQL\<version>\bin\psql.exe" -U postgres -d elms -f server/database_schema.sql
```

**Option C: If your PostgreSQL is on a different port (default is 5432, but yours is 1234):**
```bash
psql -U postgres -d elms -p 1234 -f server/database_schema.sql
```

**Option D: If the database doesn't exist yet, create it first:**
```bash
# First create the database
psql -U postgres -p 1234 -c "CREATE DATABASE elms;"

# Then run the schema
psql -U postgres -d elms -p 1234 -f server/database_schema.sql
```

You will be prompted to enter your PostgreSQL password.

---

## Method 2: Using pgAdmin (GUI - Easiest)

### Step 1: Open pgAdmin
- Launch pgAdmin from your Start menu or desktop

### Step 2: Connect to your PostgreSQL server
- Expand "Servers" in the left panel
- Click on your PostgreSQL server (usually "PostgreSQL 15" or similar)
- Enter your password if prompted

### Step 3: Create the database (if it doesn't exist)
1. Right-click on "Databases"
2. Select "Create" → "Database..."
3. Name: `elms`
4. Click "Save"

### Step 4: Run the SQL file
1. Right-click on the `elms` database
2. Select "Query Tool"
3. Click the "Open File" button (folder icon) or press `Ctrl+O`
4. Navigate to: `C:\Users\Krish Chaudhari\OneDrive\Desktop\PulseHR\PulseHR\server\database_schema.sql`
5. Click "Open"
6. Click the "Execute" button (play icon) or press `F5`

---

## Method 3: Using PostgreSQL Command Line (psql) - Interactive

### Step 1: Connect to PostgreSQL
```bash
psql -U postgres -p 1234
```

### Step 2: Create database (if needed)
```sql
CREATE DATABASE elms;
```

### Step 3: Connect to the database
```sql
\c elms
```

### Step 4: Run the SQL file
```sql
\i server/database_schema.sql
```

Or if you're in a different directory:
```sql
\i C:/Users/Krish Chaudhari/OneDrive/Desktop/PulseHR/PulseHR/server/database_schema.sql
```

---

## Method 4: Copy and Paste in pgAdmin Query Tool

### Step 1: Open the SQL file
- Open `server/database_schema.sql` in any text editor (Notepad, VS Code, etc.)

### Step 2: Copy all contents
- Press `Ctrl+A` to select all
- Press `Ctrl+C` to copy

### Step 3: Paste in pgAdmin
1. Open pgAdmin
2. Connect to your server
3. Right-click on `elms` database → "Query Tool"
4. Paste the SQL (`Ctrl+V`)
5. Click "Execute" or press `F5`

---

## Verify the Setup

After running the schema, verify it worked:

### Using psql:
```bash
psql -U postgres -d elms -p 1234 -c "\dt"
```

This should show all tables: employees, leave_types, leave_requests, leave_status, departments

### Using pgAdmin:
1. Expand the `elms` database
2. Expand "Schemas" → "public" → "Tables"
3. You should see: employees, leave_types, leave_requests, leave_status, departments

### Check sample data:
```bash
psql -U postgres -d elms -p 1234 -c "SELECT * FROM leave_types;"
```

You should see 6 leave types (Sick Leave, Vacation, etc.)

---

## Troubleshooting

### "database elms does not exist"
Create it first:
```bash
psql -U postgres -p 1234 -c "CREATE DATABASE elms;"
```

### "psql: command not found"
- Add PostgreSQL bin directory to your PATH, OR
- Use the full path: `"C:\Program Files\PostgreSQL\<version>\bin\psql.exe"`
- Or use pgAdmin instead

### "password authentication failed"
- Make sure you're using the correct password
- Check your PostgreSQL server is running
- Verify the port (1234 in your case, not the default 5432)

### "connection refused" or "could not connect"
- Make sure PostgreSQL service is running
- Check the port number (you're using 1234)
- Verify host is localhost

---

## Quick Command Reference

```bash
# Find PostgreSQL installation (Windows)
dir "C:\Program Files\PostgreSQL"

# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Connect to PostgreSQL
psql -U postgres -p 1234

# Create database
psql -U postgres -p 1234 -c "CREATE DATABASE elms;"

# Run schema file
psql -U postgres -d elms -p 1234 -f server/database_schema.sql
```

