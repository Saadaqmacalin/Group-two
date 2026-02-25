const express = require('express');
const router = express.Router();
const {
  addPayment,
  getPayments,
  getPaymentById
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getPayments)
  .post(protect, admin, addPayment);

router.route('/:id')
  .get(protect, admin, getPaymentById);

module.exports = router;
