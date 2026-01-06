-- PulseHR - Employee Leave Management System Database Schema
-- Database: elms

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_status CASCADE;
DROP TABLE IF EXISTS leave_types CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Create departments table (if needed)
CREATE TABLE IF NOT EXISTS departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee', -- 'employee', 'admin', 'manager'
    dept_id INTEGER REFERENCES departments(dept_id),
    leave_type_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leave_types table
CREATE TABLE IF NOT EXISTS leave_types (
    leave_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    max_days INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leave_status table
CREATE TABLE IF NOT EXISTS leave_status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(20) NOT NULL UNIQUE
);

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    leave_id SERIAL PRIMARY KEY,
    emp_id INTEGER NOT NULL REFERENCES employees(emp_id) ON DELETE CASCADE,
    leave_type_id INTEGER NOT NULL REFERENCES leave_types(leave_type_id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    no_of_days INTEGER,
    status_id INTEGER NOT NULL DEFAULT 1 REFERENCES leave_status(status_id),
    applied_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INTEGER REFERENCES employees(emp_id),
    approved_on TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create indexes for better performance
CREATE INDEX idx_leave_requests_emp_id ON leave_requests(emp_id);
CREATE INDEX idx_leave_requests_status_id ON leave_requests(status_id);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_employees_email ON employees(email);

-- Insert default leave statuses
INSERT INTO leave_status (status_id, status_name) VALUES
    (1, 'Pending'),
    (2, 'Approved'),
    (3, 'Rejected'),
    (4, 'Cancelled')
ON CONFLICT (status_id) DO NOTHING;

-- Insert sample leave types
INSERT INTO leave_types (leave_type_id, type_name, max_days, description) VALUES
    (1, 'Sick Leave', 10, 'Leave for medical reasons'),
    (2, 'Vacation', 15, 'Annual vacation leave'),
    (3, 'Personal Leave', 5, 'Personal time off'),
    (4, 'Emergency Leave', 3, 'Emergency situations'),
    (5, 'Maternity Leave', 90, 'Maternity leave'),
    (6, 'Paternity Leave', 10, 'Paternity leave')
ON CONFLICT (leave_type_id) DO NOTHING;

-- Insert sample departments
INSERT INTO departments (dept_id, dept_name) VALUES
    (1, 'Human Resources'),
    (2, 'Engineering'),
    (3, 'Sales'),
    (4, 'Marketing'),
    (5, 'Finance')
ON CONFLICT (dept_id) DO NOTHING;

-- Insert sample admin employee (password should be hashed in production)
-- Default password: admin123 (should be changed and hashed)
INSERT INTO employees (emp_id, name, email, password, role, dept_id) VALUES
    (1, 'Admin User', 'admin@pulsehr.com', 'admin123', 'admin', 1)
ON CONFLICT (emp_id) DO NOTHING;

-- Insert sample employee
INSERT INTO employees (emp_id, name, email, password, role, dept_id) VALUES
    (2, 'John Doe', 'john.doe@pulsehr.com', 'password123', 'employee', 2)
ON CONFLICT (emp_id) DO NOTHING;

-- Create a function to automatically calculate no_of_days
CREATE OR REPLACE FUNCTION calculate_leave_days()
RETURNS TRIGGER AS $$
BEGIN
    NEW.no_of_days := (NEW.end_date - NEW.start_date) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate days
CREATE TRIGGER trigger_calculate_leave_days
    BEFORE INSERT OR UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION calculate_leave_days();

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_leave_requests_updated_at
    BEFORE UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

