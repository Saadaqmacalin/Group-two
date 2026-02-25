const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmer');

const protectFarmer = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.farmer = await Farmer.findById(decoded.id).select('-password');

      if (!req.farmer) {
        res.status(401).json({ message: 'Not authorized, farmer not found' });
        return;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

module.exports = { protectFarmer };
