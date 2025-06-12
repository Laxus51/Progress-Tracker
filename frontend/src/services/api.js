/**
 * API service for handling all backend requests
 */

// Base URL for API requests from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get the authentication headers with Clerk token
 * @returns {Object} Headers object with Authorization token
 */
async function getAuthHeaders() {
  // Get the Clerk token
  const token = await window.Clerk.session.getToken();
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Fetch all logs for the current user
 * @returns {Promise<Array>} Array of log objects
 */
export async function fetchLogs() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/logs`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
}

/**
 * Create a new log or update existing log for the same date
 * @param {Object} logData - The log data to save
 * @returns {Promise<Object>} The created or updated log
 */
export async function saveLog(logData) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(logData)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving log:', error);
    throw error;
  }
}

/**
 * Delete a log by ID
 * @param {number} logId - The ID of the log to delete
 * @returns {Promise<Object>} Success message
 */
export async function deleteLog(logId) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/logs/${logId}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting log:', error);
    throw error;
  }
}