const express = require('express');
const router = express.Router();
const { logsDb } = require('../db');
const { requireAuth, getUserId } = require('../middleware/auth');

/**
 * @route   GET /api/logs
 * @desc    Get all logs for the authenticated user
 * @access  Private
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const logs = await logsDb.getAllByUser(userId);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

/**
 * @route   POST /api/logs
 * @desc    Create a new log or update existing log for the same date
 * @access  Private
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const { date, weight, calories, protein } = req.body;

    // Validate required fields
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Check if a log already exists for this date
    const existingLog = await logsDb.getByDateAndUser(date, userId);

    let result;
    if (existingLog) {
      // Update existing log
      const updated = await logsDb.update(existingLog.id, {
        date,
        weight,
        calories,
        protein
      }, userId);

      if (!updated) {
        return res.status(404).json({ error: 'Log not found or not authorized to update' });
      }

      result = await logsDb.getById(existingLog.id, userId);
      res.json(result);
    } else {
      // Create new log
      result = await logsDb.create({
        user_id: userId,
        date,
        weight,
        calories,
        protein
      });

      res.status(201).json(result);
    }
  } catch (error) {
    console.error('Error creating/updating log:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

/**
 * @route   DELETE /api/logs/:id
 * @desc    Delete a log by ID
 * @access  Private
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }

    const logId = parseInt(req.params.id);
    if (isNaN(logId)) {
      return res.status(400).json({ error: 'Invalid log ID' });
    }

    // Check if log exists and belongs to user
    const log = await logsDb.getById(logId, userId);
    if (!log) {
      return res.status(404).json({ error: 'Log not found or not authorized to delete' });
    }

    const deleted = await logsDb.delete(logId, userId);
    if (deleted) {
      res.json({ message: 'Log deleted successfully' });
    } else {
      res.status(404).json({ error: 'Log not found or not authorized to delete' });
    }
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;