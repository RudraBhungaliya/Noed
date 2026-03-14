const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const rawProducts = [
  { id: 1, name: "Articulated Dragon Model", price: "₹1,200", material: "PLA+", finish: "Matte", geometryType: "dragon" },
  { id: 2, name: "Geometric Desk Planter", price: "₹850", material: "PETG", finish: "Glossy White", geometryType: "planter" },
  { id: 3, name: "Mechanical Gear Assembly", price: "₹2,500", material: "ABS", finish: "Industrial", geometryType: "gear" },
  { id: 4, name: "Topographical City Map", price: "₹3,400", material: "Resin", finish: "High Detail Navy", geometryType: "map" },
  { id: 5, name: "Custom Keycap Set", price: "₹600", material: "Resin", finish: "Translucent", geometryType: "keycap" },
  { id: 6, name: "Voronoi Sculpture", price: "₹1,800", material: "Silk PLA", finish: "Metallic Blue", geometryType: "sculpture" }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing product collection');

    // Insert mock catalog
    await Product.insertMany(rawProducts);
    console.log('Successfully seeded database with 6 raw products');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDB();
