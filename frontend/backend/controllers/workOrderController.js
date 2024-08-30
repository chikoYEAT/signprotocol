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


exports.updateWorkOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;  // ID of the work order to update
    const { status } = req.body;  // New status to set

    // Find the work order by ID and update status
    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }  // Return the updated document
    );

    if (!updatedWorkOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }

    // Respond with the updated work order
    res.json({ message: 'Work order status updated successfully', workOrder: updatedWorkOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating work order status', error: error.message });
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
