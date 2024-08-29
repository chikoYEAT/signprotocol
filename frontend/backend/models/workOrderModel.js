const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Completed'],
    default: 'Pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
