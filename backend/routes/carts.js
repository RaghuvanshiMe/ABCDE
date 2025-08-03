const express = require('express');
const { Cart, CartItem, Item } = require('../models');

const router = express.Router();

// Create cart
router.post('/', async (req, res) => {
  const { name, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required' });
  }
  const user = req.user;

  try {
    // Check if user already has a cart
    const existingCart = await Cart.findOne({ where: { userId: user.id } });
    if (existingCart) {
      return res.status(400).json({ error: 'User already has a cart' });
    }

    const cart = await Cart.create({
      userId: user.id,
      name,
      status: 'active',
      createdAt: new Date()
    });

    // Add items to cart_items
    for (const itemId of items) {
      await CartItem.create({
        cartId: cart.id,
        itemId
      });
    }

    // Fetch cart with items
    const createdCart = await Cart.findOne({
      where: { id: cart.id },
      include: [{ model: Item, through: { attributes: [] } }]
    });

    res.status(201).json(createdCart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create cart' });
  }
});

// List carts
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.findAll({
      include: [{ model: Item, through: { attributes: [] } }]
    });
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch carts' });
  }
});

module.exports = router;
