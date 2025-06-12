const setupDatabase = require('./setup');

// Initialize the database
let dbInstance = null;

// Initialize database and store the instance
setupDatabase()
  .then(db => {
    dbInstance = db;
    console.log('Database instance initialized successfully');
  })
  .catch(err => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  });

/**
 * Helper function to run a query with parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} - Promise resolving to query results
 */
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!dbInstance) {
      return reject(new Error('Database not initialized'));
    }
    
    dbInstance.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Query error:', err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

/**
 * Helper function to get a single row
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} - Promise resolving to a single row or null
 */
function getOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!dbInstance) {
      return reject(new Error('Database not initialized'));
    }
    
    dbInstance.get(sql, params, (err, row) => {
      if (err) {
        console.error('Query error:', err.message);
        return reject(err);
      }
      resolve(row || null);
    });
  });
}

/**
 * Helper function to run an insert/update/delete query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} - Promise resolving to result info
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!dbInstance) {
      return reject(new Error('Database not initialized'));
    }
    
    dbInstance.run(sql, params, function(err) {
      if (err) {
        console.error('Query error:', err.message);
        return reject(err);
      }
      
      // 'this' contains lastID and changes properties
      resolve({
        lastID: this.lastID,
        changes: this.changes
      });
    });
  });
}

/**
 * Database operations for logs
 */
const logsDb = {
  /**
   * Get all logs for a specific user, ordered by date descending
   * @param {string} userId - The Clerk user ID
   * @returns {Promise<Array>} - Promise resolving to array of log objects
   */
  getAllByUser: (userId) => {
    return runQuery('SELECT * FROM logs WHERE user_id = ? ORDER BY date DESC', [userId]);
  },

  /**
   * Get a specific log by ID and user ID
   * @param {number} id - The log ID
   * @param {string} userId - The Clerk user ID
   * @returns {Promise<Object|null>} - Promise resolving to the log object or null if not found
   */
  getById: (id, userId) => {
    return getOne('SELECT * FROM logs WHERE id = ? AND user_id = ?', [id, userId]);
  },

  /**
   * Create a new log for a user
   * @param {Object} log - The log object
   * @param {string} log.user_id - The Clerk user ID
   * @param {string} log.date - The date in ISO format (YYYY-MM-DD)
   * @param {number} log.weight - The weight value
   * @param {number} log.calories - The calories value
   * @param {number} log.protein - The protein value
   * @returns {Promise<Object>} - Promise resolving to the created log with ID
   */
  create: async (log) => {
    const result = await run(
      'INSERT INTO logs (user_id, date, weight, calories, protein) VALUES (?, ?, ?, ?, ?)',
      [
        log.user_id,
        log.date,
        log.weight || null,
        log.calories || null,
        log.protein || null
      ]
    );
    
    return { id: result.lastID, ...log };
  },

  /**
   * Update an existing log
   * @param {number} id - The log ID
   * @param {Object} log - The log object with updated values
   * @param {string} userId - The Clerk user ID
   * @returns {Promise<boolean>} - Promise resolving to true if updated, false if not found
   */
  update: async (id, log, userId) => {
    const result = await run(
      'UPDATE logs SET date = ?, weight = ?, calories = ?, protein = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [
        log.date,
        log.weight || null,
        log.calories || null,
        log.protein || null,
        id,
        userId
      ]
    );
    
    return result.changes > 0;
  },

  /**
   * Delete a log by ID and user ID
   * @param {number} id - The log ID
   * @param {string} userId - The Clerk user ID
   * @returns {Promise<boolean>} - Promise resolving to true if deleted, false if not found
   */
  delete: async (id, userId) => {
    const result = await run('DELETE FROM logs WHERE id = ? AND user_id = ?', [id, userId]);
    return result.changes > 0;
  },

  /**
   * Check if a log exists for a specific date and user
   * @param {string} date - The date in ISO format (YYYY-MM-DD)
   * @param {string} userId - The Clerk user ID
   * @returns {Promise<Object|null>} - Promise resolving to the log object or null if not found
   */
  getByDateAndUser: (date, userId) => {
    return getOne('SELECT * FROM logs WHERE date = ? AND user_id = ?', [date, userId]);
  }
};

module.exports = {
  logsDb,
  getDbInstance: () => dbInstance
};