const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');
const STATS_PATH = path.join(__dirname, '../../../data/stats.json');

async function updateStats(item) {
  try {
    const statsRaw = await fs.promises.readFile(STATS_PATH, 'utf8');
    let stats = JSON.parse(statsRaw);

    // Update total count and average price
    stats.total += 1;
    stats.averagePrice = ((stats.averagePrice * (stats.total - 1)) + item.price) / stats.total;

    // Write updated stats back to file
    await fs.promises.writeFile(STATS_PATH, JSON.stringify(stats, null, 2));
  } catch (err) {
    console.error("Error updating stats:", err);
    throw err;
  }
}

// Utility to read data (intentionally sync to highlight blocking issue)
async function readData() {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, "utf8");
    try {
      return JSON.parse(raw);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      throw parseErr;
    }
  } catch (err) {
    console.error("Error reading file:", err);
    throw err;
  }
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q, page } = req.query;
    let results = data;

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    const totalItems = results.length;
    const pageSize = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedResults = results.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      items: paginatedResults,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // Validate payload
    if (!req.body || typeof req.body !== 'object') {
      const err = new Error('Request body must be a valid JSON object');
      err.status = 400;
      throw err;
    }

    const { name, category, price } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      const err = new Error('Name is required and must be a non-empty string');
      err.status = 400;
      throw err;
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      const err = new Error('Category is required and must be a non-empty string');
      err.status = 400;
      throw err;
    }

    if (price === undefined || price === null || typeof price !== 'number' || price < 0) {
      const err = new Error('Price is required and must be a non-negative number');
      err.status = 400;
      throw err;
    }

    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);

    // Calculate and save new average price and total count
    await updateStats(item)
  
    await fs.promises.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);  
  }
});

module.exports = router;
module.exports.readData = readData;