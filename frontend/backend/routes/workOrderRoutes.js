const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/workOrderModel'); // Import the model

// Define your routes here
router.post('/', async (req, res) => {
  try {
    // Create a new work order using data from the request body
    const workOrder = new WorkOrder({
      workOrderTitle: req.body.workOrderTitle,
      description: req.body.description,
      assignedTo: req.body.assignedTo,
      status: req.body.status
    });

    // Save the work order to the database
    await workOrder.save();

    // Respond with the created work order
    res.status(201).json(workOrder);
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ message: 'Failed to create work order', error });
  }
});

module.exports = router;
