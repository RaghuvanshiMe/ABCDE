const express = require('express');
const { Order, Cart } = require('../models');

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  const { cart_id } = req.body;
  if (!cart_id) {
    return res.status(400).json({ error: 'cart_id is required' });
  }
  const user = req.user;

  try {
    // Check if cart belongs to user
    const cart = await Cart.findOne({ where: { id: cart_id, userId: user.id } });
    if (!cart) {
      return res.status(400).json({ error: 'Cart not found or does not belong to user' });
    }

    const order = await Order.create({
      cartId: cart.id,
      userId: user.id,
      createdAt: new Date()
    });

    // Update cart status to "ordered"
    cart.status = 'ordered';
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// List orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
