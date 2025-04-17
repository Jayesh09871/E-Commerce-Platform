const express = require('express');
const { 
  createOrder, 
  getOrderById, 
  getMyOrders, 
  getOrders,
  updateOrderStatus,
  getRiderOrders
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, authorize('admin'), getOrders);

// Admin and rider routes
router.put('/:id/status', protect, authorize('admin', 'rider'), updateOrderStatus);

// Rider routes
router.get('/rider/assigned', protect, authorize('rider'), getRiderOrders);

module.exports = router;
