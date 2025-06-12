const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

/**
 * Middleware to require authentication using Clerk
 * This will validate the JWT token in the request header
 */
const requireAuth = ClerkExpressRequireAuth({
  // Optional: Customize the error response
  onError: (err, req, res) => {
    console.error('Authentication error:', err.message);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
});

/**
 * Extract the user ID from the Clerk auth object
 * @param {Object} req - Express request object
 * @returns {string|null} - The user ID or null if not authenticated
 */
const getUserId = (req) => {
  if (!req.auth || !req.auth.userId) {
    return null;
  }
  return req.auth.userId;
};

module.exports = {
  requireAuth,
  getUserId
};