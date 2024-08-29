// models/WorkOrder.js
const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  workOrderTitle: String,
  description: String,
  assignedTo: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
