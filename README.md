# PulseHR

Role-based employee leave management system that streamlines leave requests, approvals, and leave balance tracking through a centralized workflow.

## Overview

PulseHR is a full-stack web application designed to simplify leave management for employees, managers, and HR teams.

Employees can submit leave requests, track approval status, and monitor leave history. Managers and HR personnel can review requests, approve or reject applications, and maintain accurate leave records through a dedicated admin dashboard.

The project was built to explore authentication, role-based authorization, workflow automation, REST API development, and full-stack application deployment.

## Tech Stack

### Frontend

* React.js

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Authentication

* JWT Authentication
* bcrypt Password Hashing

### DevOps

* Docker
* Docker Compose

## Core Features

* Secure login and authentication using JWT
* Role-based access control for Employee, Manager, and HR users
* Leave application submission with validation
* Admin dashboard for reviewing pending leave requests
* Leave approval and rejection workflow
* Automatic leave balance calculation and updates
* Leave history tracking for employees
* RESTful APIs integrated with PostgreSQL
* Containerized deployment using Docker

## System Workflow

Employee Login → Leave Application → Manager/HR Review → Approval or Rejection → Leave Balance Update → Leave History Tracking

## Setup

### Clone Repository

```bash
git clone https://github.com/krishfr/PulseHR.git
cd PulseHR
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Environment Variables

```bash
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
```

## Run Locally

```bash
docker-compose up
```

## Access Application

```bash
http://localhost:3000
```

## Use Cases

* Employee leave request management
* HR leave tracking and record maintenance
* Manager approval workflows
* Small and medium-sized organization HR operations
* Internal workforce management systems

## Key Learnings

* Designing role-based authentication and authorization systems
* Building secure REST APIs with Express.js
* Managing relational data using PostgreSQL
* Implementing workflow-driven business logic
* Debugging authorization and role-mapping issues in production-like environments
* Containerizing full-stack applications with Docker
* Managing frontend, backend, and database services through Docker Compose

## Future Enhancements

* Email notifications for leave status updates
* Leave analytics and reporting dashboard
* Calendar integration
* Multi-organization support
* AWS cloud deployment

## Author

**Krish Chaudhari**
