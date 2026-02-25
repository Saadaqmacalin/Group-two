const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, staff, getCustomers)
  .post(protect, createCustomer);

router.route('/:id')
  .get(protect, staff, getCustomerById)
  .put(protect, staff, updateCustomer)
  .delete(protect, admin, deleteCustomer); // Keep delete restricted to admin

module.exports = router;
