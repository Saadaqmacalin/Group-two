const express = require('express');
const router = express.Router();
const {
  registerFarmer,
  loginFarmer,
  getFarmerProducts,
  createFarmerProduct,
  getFarmerSales,
  getFarmers,
  deleteFarmer
} = require('../controllers/farmerController');
const { protectFarmer } = require('../middleware/farmerAuthMiddleware');
const { protect, admin, staff } = require('../middleware/authMiddleware');
const { createCategory } = require('../controllers/categoryController');

const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerFarmer);
router.post('/login', loginFarmer);

// Admin Routes (for managing farmers)
router.get('/', protect, staff, getFarmers);
router.delete('/:id', protect, admin, deleteFarmer);

// Protected routes
router.get('/products', protectFarmer, getFarmerProducts);
router.post('/products', protectFarmer, createFarmerProduct);
router.get('/sales', protectFarmer, getFarmerSales);
router.post('/categories', protectFarmer, createCategory);

// Image Upload
router.post('/upload', protectFarmer, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ url: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

module.exports = router;
