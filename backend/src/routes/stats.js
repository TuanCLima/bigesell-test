const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const STATS_PATH = path.join(__dirname, '../../../data/stats.json');



// GET /api/stats
router.get('/', async (_, res) => {
  try {
    const raw = await fs.promises.readFile(STATS_PATH, 'utf8');
    const stats = JSON.parse(raw);
    res.json(stats);
  } catch (error) {
    console.error('Error reading stats:', error);
    res.status(500).json({ error: 'Failed to retrieve stats' });   
  }
});

module.exports = router;