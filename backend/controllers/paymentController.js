const Payment = require('../models/payments');
const Order = require('../models/orders');


const addPayment = async (req, res) => {
  const { order, amount, paymentMethod, status, transactionId } = req.body;

  try {
    const payment = await Payment.create({
      order,
      amount,
      paymentMethod,
      status,
      transactionId
    });

    // Update order payment status if payment is completed
    if (status === 'Completed') {
      const orderToUpdate = await Order.findById(order);
      if (orderToUpdate) {
        orderToUpdate.paymentStatus = 'Paid';
        await orderToUpdate.save();
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).populate('order');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('order');

    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPayment,
  getPayments,
  getPaymentById
};
