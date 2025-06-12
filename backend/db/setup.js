const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Get database path from environment variables or use default
const dbPath = process.env.DB_PATH || './gymtracker.db';

// Create a new database connection
function setupDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Ensure the path is resolved correctly
      const resolvedPath = path.resolve(dbPath);
      console.log(`Setting up database at: ${resolvedPath}`);
      
      // Ensure directory exists
      const dbDir = path.dirname(resolvedPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      // Create database connection
      const db = new sqlite3.Database(resolvedPath, (err) => {
        if (err) {
          console.error('Database connection error:', err.message);
          reject(err);
          return;
        }
        console.log('Connected to the SQLite database');
      });
      
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
          console.error('Failed to enable foreign keys:', err.message);
        }
      });
      
      // Create logs table if it doesn't exist
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          date TEXT NOT NULL,
          weight REAL,
          calories INTEGER,
          protein INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      db.run(createTableSQL, (err) => {
        if (err) {
          console.error('Table creation error:', err.message);
          reject(err);
          return;
        }
        
        // Create index on user_id
        db.run('CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id)', (err) => {
          if (err) {
            console.error('Index creation error (user_id):', err.message);
            reject(err);
            return;
          }
          
          // Create index on date
          db.run('CREATE INDEX IF NOT EXISTS idx_logs_date ON logs(date)', (err) => {
            if (err) {
              console.error('Index creation error (date):', err.message);
              reject(err);
              return;
            }
            
            console.log('Database setup completed successfully');
            resolve(db);
          });
        });
      });
    } catch (error) {
      console.error('Database setup failed:', error.message);
      reject(error);
    }
  });
}

module.exports = setupDatabase;