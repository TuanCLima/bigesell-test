const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');
const STATS_PATH = path.join(__dirname, '../../../data/stats.json');


const calculateAndSaveStats = async () => {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf8');
    const items = JSON.parse(raw);
    
    const stats = {
      total: items.length,
      averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length,
      lastUpdated: new Date().toISOString() // For good measure
    };

    await fs.promises.writeFile(STATS_PATH, JSON.stringify(stats, null, 2));
    console.log('Stats updated and saved');
  } catch (error) {
    console.error('Error calculating stats:', error);
  }
};

// Watch for changes in DATA_PATH and recalculate stats
fs.watchFile(DATA_PATH, { interval: 1000 }, () => {
  calculateAndSaveStats();
});

// Calculate initial stats on startup
calculateAndSaveStats();

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