const Sale = require('../models/selles');
const Product = require('../models/products');

// @desc    Add a sale record
// @route   POST /api/sales
// @access  Private/Admin
const addSale = async (req, res) => {
  const { product, quantity, totalAmount, customer } = req.body;

  try {
    const sale = await Sale.create({
      product,
      quantity,
      totalAmount,
      customer
    });

    // Reduce product stock
    const productData = await Product.findById(product);
    if (productData) {
      productData.countInStock -= quantity;
      await productData.save();
    }

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private/Admin
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({})
      .populate('product', 'name price')
      .populate('customer', 'name email');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sales summary
// @route   GET /api/sales/summary
// @access  Private/Admin
const getSalesSummary = async (req, res) => {
  try {
    const totalSales = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(totalSales[0] || { totalRevenue: 0, count: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSale,
  getSales,
  getSalesSummary
};
