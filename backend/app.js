const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');
const authMiddleware = require('./middleware');

const { sequelize } = require('./db');

const app = express();

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/users', userRoutes);
app.use('/items', itemRoutes);
app.use('/carts', authMiddleware, cartRoutes);
app.use('/orders', authMiddleware, orderRoutes);

// Sync models
const { User, Item, Cart, CartItem, Order } = require('./models');

sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

module.exports = { app, sequelize };
