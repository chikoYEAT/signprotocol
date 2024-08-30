const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'], 
    default: 'user'
  },
});

module.exports = mongoose.model('User', userSchema);
