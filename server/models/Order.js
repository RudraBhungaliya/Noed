const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Null if guest checkout 
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Shop', 'Custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  amount: {
    type: String,
    required: true
  },
  // For shop orders
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: String
  }],
  // For custom orders
  customDescription: String,
  referenceFileName: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
