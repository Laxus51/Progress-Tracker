# Gym Tracker Backend

A Node.js + Express backend for a gym tracker application with SQLite database and Clerk authentication.

## Tech Stack

- Express.js - Web server framework
- SQLite (via better-sqlite3) - Database
- Clerk - Authentication
- CORS - Cross-Origin Resource Sharing
- dotenv - Environment variables

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository (if not already done)
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   CLERK_SECRET_KEY=your_clerk_secret_key
   DB_PATH=./gymtracker.db
   ```

### Running the Server

#### Development Mode

```
npm run dev
```

This will start the server with nodemon for automatic reloading during development.

#### Production Mode

```
npm start
```

## API Endpoints

### Authentication

All endpoints require authentication via Clerk. Include the Clerk session token in the `Authorization` header.

### Logs

#### GET /api/logs

Returns all logs for the authenticated user, ordered by date (descending).

**Response:**
```json
[
  {
    "id": 1,
    "user_id": "clerk_user_id",
    "date": "2023-06-15",
    "weight": 75.5,
    "calories": 2200,
    "protein": 150,
    "created_at": "2023-06-15T12:00:00.000Z",
    "updated_at": "2023-06-15T12:00:00.000Z"
  },
  // ...
]
```

#### POST /api/logs

Creates a new log or updates an existing log for the same date.

**Request Body:**
```json
{
  "date": "2023-06-15",
  "weight": 75.5,
  "calories": 2200,
  "protein": 150
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": "clerk_user_id",
  "date": "2023-06-15",
  "weight": 75.5,
  "calories": 2200,
  "protein": 150
}
```

#### DELETE /api/logs/:id

Deletes a specific log by ID (only if it belongs to the authenticated user).

**Response:**
```json
{
  "message": "Log deleted successfully"
}
```

## Database Schema

### logs

| Column     | Type    | Description                      |
|------------|---------|----------------------------------|
| id         | INTEGER | Primary key                      |
| user_id    | TEXT    | Clerk user ID                    |
| date       | TEXT    | ISO date string (YYYY-MM-DD)     |
| weight     | REAL    | Weight in kg                     |
| calories   | INTEGER | Calories consumed                |
| protein    | INTEGER | Protein consumed in grams        |
| created_at | TEXT    | Timestamp of creation            |
| updated_at | TEXT    | Timestamp of last update         |

## Project Structure

```
/backend
  /db
    setup.js       # Database initialization
    index.js       # Database operations
  /middleware
    auth.js        # Authentication middleware
  /routes
    logs.js        # Log endpoints
  index.js         # Main application entry
  .env             # Environment variables
  package.json     # Dependencies and scripts
```

## License

MIT