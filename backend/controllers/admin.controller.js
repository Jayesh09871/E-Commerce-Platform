const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const ApprovedEmail = require('../models/approvedEmail.model');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Get total riders count
    const totalRiders = await User.countDocuments({ role: 'rider' });
    
    // Get total products count
    const totalProducts = await Product.countDocuments();
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    
    // Get orders by status
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const paidOrders = await Order.countDocuments({ status: 'paid' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const undeliveredOrders = await Order.countDocuments({ status: 'undelivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRiders,
        totalProducts,
        totalOrders,
        totalRevenue,
        ordersByStatus: {
          pending: pendingOrders,
          paid: paidOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          undelivered: undeliveredOrders,
          cancelled: cancelledOrders,
        },
        recentOrders,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { role, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, address } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Check if user is an admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user',
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Get all approved emails
// @route   GET /api/admin/approved-emails
// @access  Private/Admin
exports.getApprovedEmails = async (req, res) => {
  try {
    const approvedEmails = await ApprovedEmail.find()
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: approvedEmails.length,
      data: approvedEmails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Add approved email
// @route   POST /api/admin/approved-emails
// @access  Private/Admin
exports.addApprovedEmail = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    // Check if email already exists
    const existingEmail = await ApprovedEmail.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already approved',
      });
    }
    
    // Create approved email
    const approvedEmail = await ApprovedEmail.create({
      email,
      role: role || 'user',
      addedBy: req.user.id,
    });
    
    res.status(201).json({
      success: true,
      data: approvedEmail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Delete approved email
// @route   DELETE /api/admin/approved-emails/:id
// @access  Private/Admin
exports.deleteApprovedEmail = async (req, res) => {
  try {
    const approvedEmail = await ApprovedEmail.findById(req.params.id);
    
    if (!approvedEmail) {
      return res.status(404).json({
        success: false,
        message: 'Approved email not found',
      });
    }
    
    await approvedEmail.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Approved email deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};

// @desc    Get all riders
// @route   GET /api/admin/riders
// @access  Private/Admin
exports.getRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: riders.length,
      data: riders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message,
    });
  }
};
