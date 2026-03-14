const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders
// Submit a new order (Custom or Shop)
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error creating order');
  }
});

// GET /api/orders/admin
// Fetch all orders for the Admin Dashboard
router.get('/admin', async (req, res) => {
  try {
    // In production, we'd add JWT middleware here to verify req.user.isAdmin
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching admin orders');
  }
});

module.exports = router;
