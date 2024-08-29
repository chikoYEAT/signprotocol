const express = require('express');
const router = express.Router();
const { createWorkOrder, approveWorkOrder, getAllWorkOrders, getWorkOrderById } = require('../controllers/workOrderController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Middleware to protect routes
router.use(authenticate);

// Route to create a work order
router.post('/', authorize('admin'), createWorkOrder);

// Route to approve a work order
router.patch('/:id/approve', authorize('admin'), approveWorkOrder);

// Route to get all work orders (can be filtered based on role)
router.get('/', getAllWorkOrders);

// Route to get a specific work order by ID
router.get('/:id', getWorkOrderById);

module.exports = router;
