const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, admin, staff, staffOrFarmer } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(staffOrFarmer, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(staffOrFarmer, updateCategory)
  .delete(staffOrFarmer, deleteCategory);

module.exports = router;
