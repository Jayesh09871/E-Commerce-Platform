const express = require('express');
const { 
  getDashboardStats, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getApprovedEmails,
  addApprovedEmail,
  deleteApprovedEmail,
  getRiders
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Approved emails routes
router.get('/approved-emails', getApprovedEmails);
router.post('/approved-emails', addApprovedEmail);
router.delete('/approved-emails/:id', deleteApprovedEmail);

// Rider management routes
router.get('/riders', getRiders);

module.exports = router;
