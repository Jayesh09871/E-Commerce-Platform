const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Rider = require('../models/Rider');

// Product routes
router.get('/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, color, size } = req.query;
    let query = {};

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (color) query['colors.name'] = color;
    if (size) query['sizes.name'] = size;

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    product.totalStock = product.sizes.reduce((total, size) => total + size.stock, 0);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    Object.keys(req.body).forEach(key => {
      product[key] = req.body[key];
    });

    if (req.body.sizes) {
      product.totalStock = product.sizes.reduce((total, size) => total + size.stock, 0);
    }
    product.updatedAt = new Date();

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order routes
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product').populate('rider');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/orders', async (req, res) => {
  const order = new Order(req.body);
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = req.body.status;
    if (req.body.status === 'Shipped') {
      order.assignedAt = new Date();
    }
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rider routes
router.get('/riders', async (req, res) => {
  try {
    const riders = await Rider.find().populate('currentOrders').populate('completedOrders');
    res.json(riders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/riders/:id/orders', async (req, res) => {
  try {
    const { orderId } = req.body;
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ message: 'Rider not found' });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    rider.currentOrders.push(orderId);
    rider.status = 'On Delivery';
    order.rider = rider._id;
    order.status = 'Shipped';
    order.assignedAt = new Date();

    await Promise.all([rider.save(), order.save()]);
    res.json({ rider, order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;