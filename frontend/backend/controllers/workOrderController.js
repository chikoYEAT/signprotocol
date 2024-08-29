const WorkOrder = require('../models/workOrderModel');

exports.createWorkOrder = async (req, res) => {
  try {
    const { title, description, createdBy } = req.body;
    const newWorkOrder = new WorkOrder({
      title,
      description,
      createdBy,
      status: 'pending',
    });

    await newWorkOrder.save();
    res.status(201).json({ message: 'Work order created successfully', workOrder: newWorkOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating work order', error: error.message });
  }
};

// Approve a work order
exports.approveWorkOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }

    if (workOrder.status !== 'Pending') {
      return res.status(400).json({ message: 'Work order cannot be approved' });
    }

    workOrder.status = 'Approved';
    workOrder.approvedBy = req.user.id; // Track who approved the work order
    await workOrder.save();

    res.json({ message: 'Work order approved successfully', workOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Retrieve all work orders
exports.getAllWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find();
    res.json({ workOrders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Retrieve a specific work order
exports.getWorkOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }

    res.json({ workOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
