const Product = require('../models/products');


const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    countInStock
  } = req.body;

  let images = [];
  if (req.file) {
    images.push(`/uploads/${req.file.filename}`);
  }

  try {
    const product = await Product.create({
      name,
      description,
      price,
      images,
      category,
      countInStock
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getProducts = async (req, res) => {
  const { category, keyword } = req.query;
  let query = {};

  if (category) {
    query.category = category;
  }

  if (keyword) {
    query.name = { $regex: keyword, $options: 'i' };
  }

  try {
    const products = await Product.find(query).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    countInStock,
    isAvailable
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      
      if (req.file) {
        product.images = [`/uploads/${req.file.filename}`];
      }

      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
