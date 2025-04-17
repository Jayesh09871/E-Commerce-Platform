const express = require('express');
const { 
  getRiderOrders,
  updateOrderStatus
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('rider'));

// Rider routes
router.get('/orders', getRiderOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
