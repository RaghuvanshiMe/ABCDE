const express = require('express');
const { Item } = require('../models');

const router = express.Router();

// Create item
router.post('/', async (req, res) => {
  const { name, status } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const item = await Item.create({
      name,
      status,
      createdAt: new Date()
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// List items
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

module.exports = router;
