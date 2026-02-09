# Personal Task & Time Tracker

A productivity application for managing tasks and tracking time. Built with React and NestJS.

## Tech Stack

**Frontend**
- React 18.2.0 with TypeScript
- React Router for navigation
- Context API for state management
- CSS3 for styling

**Backend**
- NestJS 10.x with TypeScript
- PostgreSQL 14+
- TypeORM for database management
- JWT authentication
- bcrypt for password hashing

**Development**
- Node.js 18+
- npm 9+
- Git

## What's Included

**Core Functionality**
- User authentication (register, login, logout)
- Task management (create, edit, delete, mark complete)
- Time tracking with start/stop timer
- Dashboard with productivity analytics

**Additional Features**
- Task categories and tags
- Filter and sort capabilities
- Task priority levels
- Search functionality

```

## Getting Started

**What You'll Need**
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Setting Up the Database

Open your PostgreSQL terminal:

```bash
psql -U postgres
```

Create the database:

```sql
CREATE DATABASE task_tracker;

-- Optional: create a dedicated user
CREATE USER task_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE task_tracker TO task_user;

\q
```

### Setting Up the Backend

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory with these values:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=task_tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
```

Start the server (this will auto-create the database tables):

```bash
npm start
```

The backend will be available at `http://localhost:3001`

Note: For production deployments, you should use proper database migrations instead of auto-synchronization.

### Setting Up the Frontend

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

## Using the API

All task-related endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

**Authentication**

Register a new user:
```
POST /auth/register
Body: { name, email, password, confirm password }
```

Login:
```
POST /auth/login
Body: { email, password }
Returns: { access_token, user }
```

**Tasks**

Get all tasks:
```
GET /tasks
Query params: status, category, priority, search
```

Create a task:
```
POST /tasks
Body: { title, description?, category?, priority? }
```

Get a single task:
```
GET /tasks/:id
```

Update a task:
```
PATCH /tasks/:id
Body: { title?, description?, status?, category?, priority? }
```

Delete a task:
```
DELETE /tasks/:id
```

Start the timer:
```
POST /tasks/:id/start
```

Stop the timer:
```
POST /tasks/:id/stop
```

**User Profile**

Get your profile:
```
GET /users/profile
```

Get productivity stats:
```
GET /users/stats
```

## Running Everything

1. Make sure PostgreSQL is running
2. Start the backend: `cd backend && npm start`
3. Start the frontend: `cd frontend && npm start`
4. Visit `http://localhost:3000` in your browser
5. Create an account and start tracking tasks

## Testing It Out

Here's a quick way to test all the features:

1. Register a new account
2. Create a few tasks with different categories
3. Start the timer on one of your tasks
4. Let it run for a bit, then stop it
5. Mark some tasks as complete
6. Check out the dashboard to see your stats
7. Try out the search and filter options

## Database Structure

**Users**
- id (UUID, primary key)
- email (unique)
- password (hashed)
- name
- createdAt

**Tasks**
- id (UUID, primary key)
- title
- description (optional)
- status ('pending', 'in_progress', or 'completed')
- category (optional)
- priority ('low', 'medium', or 'high')
- userId (links to Users)
- createdAt
- updatedAt

**TimeEntries**
- id (UUID, primary key)
- taskId (links to Tasks)
- startTime
- endTime (null if timer is running)
- duration (in seconds)

## Version Control

Example commit workflow:

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit: Project setup with NestJS and React"

# Working on features
git checkout -b feature/task-management
git add .
git commit -m "feat: Add task CRUD operations"
git commit -m "feat: Add time tracking functionality"
git commit -m "feat: Add authentication with JWT"
git commit -m "feat: Add dashboard with statistics"
git commit -m "style: Improve UI/UX for task list"
```

## Common Issues

**Can't Connect to Database**
- Check if PostgreSQL is running: `sudo service postgresql status`
- Double-check your credentials in the `.env` file
- Make sure the database exists: `psql -U postgres -l`

**Port Already in Use**
- For the backend: change the `PORT` value in your backend `.env` file
- For the frontend: run `PORT=3002 npm start` instead

**CORS Errors**
- The backend is already set up for `http://localhost:3000`
- If you're using a different port, update the CORS settings in `backend/src/main.ts`

## Implementation Notes

A few things to keep in mind:

- The backend uses TypeORM's `synchronize: true` option, which automatically creates tables during development. For production, you should disable this and use proper migrations.
- JWT tokens are valid for 24 hours by default, but you can change this in the config.
- All passwords are hashed with bcrypt before being stored.
- Time tracking uses seconds for precision.

## License

MIT
