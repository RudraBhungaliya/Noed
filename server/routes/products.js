const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
// Fetch all 3D products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error fetching products');
  }
});

// POST /api/products (Admin Only setup)
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error creating product');
  }
});

module.exports = router;
