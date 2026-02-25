const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, staff, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, staff, updateCategory)
  .delete(protect, staff, deleteCategory);

module.exports = router;
