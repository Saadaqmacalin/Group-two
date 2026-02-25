const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, admin, staff } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, staff, upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, staff, upload.single('image'), updateProduct)
  .delete(protect, staff, deleteProduct);

module.exports = router;
