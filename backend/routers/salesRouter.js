const express = require('express');
const router = express.Router();
const {
  addSale,
  getSales,
  getSalesSummary
} = require('../controllers/salesController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getSales)
  .post(protect, admin, addSale);

router.route('/summary')
  .get(protect, admin, getSalesSummary);

module.exports = router;
