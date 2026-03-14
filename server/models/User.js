const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  firstName: String,
  lastName: String,
  phone: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
