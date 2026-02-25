const Product = require('../models/products');
const Customer = require('../models/customers');
const Order = require('../models/orders');
const Sale = require('../models/selles');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const salesSummary = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      products: totalProducts,
      customers: totalCustomers,
      orders: totalOrders,
      sales: salesSummary[0] || { totalRevenue: 0, count: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
