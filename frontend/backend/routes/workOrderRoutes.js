const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/workOrderModel'); // Adjust the path if necessary

router.post('/', async (req, res) => {
  try {
    const { workOrderTitle, description, assignedTo, createdBy, username } = req.body;
    const workOrder = new WorkOrder({
      workOrderTitle,
      description,
      assignedTo,
      username,
      createdBy
    });
    await workOrder.save();

    res.status(201).send('Work order created successfully');
  } catch (error) {
    console.error('Error creating work order:', error.message);
    res.status(500).send('Error creating work order');
  }
});

router.get('/', async (req, res) => {
  try {
    const { username } = req.query;
    const query = username ? { username } : {};
    const workOrders = await WorkOrder.find(query);
    res.status(200).json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error.message);
    res.status(500).send('Error fetching work orders');
  }
});

/*http://localhost:5000/api/work-orders?username=nsut.ac.in*/
/*http://localhost:5000/api/work-orders*/

module.exports = router;
