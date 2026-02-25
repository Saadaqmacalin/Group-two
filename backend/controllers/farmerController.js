const Farmer = require('../models/farmer');
const Product = require('../models/products');
const Order = require('../models/orders');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new farmer
// @route   POST /api/farmers/register
// @access  Public
exports.registerFarmer = async (req, res) => {
  try {
    const { name, email, password,  location, phoneNumber, bio } = req.body;

    const farmerExists = await Farmer.findOne({ email });

    if (farmerExists) {
      return res.status(400).json({ message: 'Farmer already exists' });
    }

    const farmer = await Farmer.create({
      name,
      email,
      password,
      location,
      phoneNumber,
      bio
    });

    if (farmer) {
      res.status(201).json({
        _id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        token: generateToken(farmer._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth farmer & get token
// @route   POST /api/farmers/login
// @access  Public
exports.loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const farmer = await Farmer.findOne({ email }).select('+password');

    if (farmer && (await farmer.matchPassword(password))) {
      res.json({
        _id: farmer._id,
        name: farmer.name,
        email: farmer.email,
       
        role: farmer.role,
        token: generateToken(farmer._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get farmer products
// @route   GET /api/farmers/products
// @access  Private (Farmer only)
exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.farmer._id }).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create farmer product
// @route   POST /api/farmers/products
// @access  Private (Farmer only)
exports.createFarmerProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, countInStock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      countInStock,
      farmer: req.farmer._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get farmer sales
// @route   GET /api/farmers/sales
// @access  Private (Farmer only)
exports.getFarmerSales = async (req, res) => {
  try {
    // Find orders that contain products owned by this farmer
    const farmerProducts = await Product.find({ farmer: req.farmer._id }).select('_id');
    const productIds = farmerProducts.map(p => p._id);

    const orders = await Order.find({
      'orderItems.product': { $in: productIds }
    }).populate('customer', 'name email phoneNumber');

    // Filter order items to only show those belonging to the farmer
    const farmerSales = orders.map(order => {
      const items = order.orderItems.filter(item => 
        productIds.some(id => id.equals(item.product))
      );
      
      return {
        _id: order._id,
        customer: order.customer,
        items,
        totalPrice: items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        status: order.status,
        createdAt: order.createdAt
      };
    });

    res.json(farmerSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get all farmers
// @route   GET /api/farmers
// @access  Private (Admin/Staff only)
exports.getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find({}).select('-password');
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete farmer
// @route   DELETE /api/farmers/:id
// @access  Private (Admin only)
exports.deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);

    if (farmer) {
      await Farmer.findByIdAndDelete(req.params.id);
      res.json({ message: 'Farmer removed' });
    } else {
      res.status(404).json({ message: 'Farmer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
