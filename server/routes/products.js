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

// GET /api/products/:id
// Fetch single product by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error fetching single product');
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
