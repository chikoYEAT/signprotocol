// models/WorkOrder.js
const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  workOrderTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String
  },
  signed: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  username: {
    type: String,
    required: true
  },
  createdBy: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);
