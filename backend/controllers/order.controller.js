const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      taxPrice, 
      shippingPrice, 
      totalPrice 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    // Verify all products exist and have sufficient stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      // Find the specific variant
      let variant = null;
      if (item.color && item.size) {
        variant = product.variants.find(
          v => v.color.name === item.color.name && v.size === item.size
        );
      }

      // Check stock
      const stockToCheck = variant ? variant.stock : product.stock;
      if (stockToCheck < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name} (${item.color?.name || 'Default'}, ${item.size || 'Default'})`,
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      isPaid: paymentMethod !== 'cash_on_delivery',
      paidAt: paymentMethod !== 'cash_on_delivery' ? Date.now() : null,
    });

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      // Find the specific variant
      let variant = null;
      if (item.color && item.size) {
        variant = product.variants.find(
          v => v.color.name === item.color.name && v.size === item.size
        );
        
        if (variant) {
          variant.stock -= item.quantity;
        }
      }
      
      if (!variant) {
        product.stock -= item.quantity;
      }
      
      await product.save();
    }

    res.status(201).json({
      success: true,
      data: order,
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('rider', 'name email phone')
      .populate({
        path: 'items.product',
        select: 'name price image description'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if the user is authorized to view this order
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'rider' && 
      order.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    // If rider, check if the order is assigned to them
    if (req.user.role === 'rider' && (!order.rider || order.rider._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
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

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
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

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('rider', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      data: orders,
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Rider
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, riderId } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    // Check if user is authorized to update this order
    if (req.user.role === 'rider') {
      // Riders can only update orders assigned to them
      if (!order.rider || order.rider.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this order',
        });
      }
      
      // Riders can only update from "shipped" to "delivered" or "undelivered"
      if (
        order.status !== 'shipped' || 
        (status !== 'delivered' && status !== 'undelivered')
      ) {
        return res.status(400).json({
          success: false,
          message: 'Riders can only update shipped orders to delivered or undelivered',
        });
      }
    }
    
    // Update order status
    order.status = status;
    
    // If status is "shipped", assign rider
    if (status === 'shipped' && riderId) {
      const rider = await User.findById(riderId);
      
      if (!rider || rider.role !== 'rider') {
        return res.status(404).json({
          success: false,
          message: 'Rider not found',
        });
      }
      
      order.rider = riderId;
    }
    
    // If status is "delivered", update delivery info
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    // If status is "paid", update payment info
    if (status === 'paid') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    
    await order.save();
    
    res.status(200).json({
      success: true,
      data: order,
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

// @desc    Get rider assigned orders
// @route   GET /api/orders/rider
// @access  Private/Rider
exports.getRiderOrders = async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = { rider: req.user.id };
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count
    const total = await Order.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      data: orders,
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
