const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Workspace Database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test Home Route
app.get('/', (req, res) => {
  res.json({ message: "Noed 3D Printing E-Commerce API is operational." });
});

// Import Routes (Routing controllers will be implemented next)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Command Center API server running on port ${PORT}`);
});
