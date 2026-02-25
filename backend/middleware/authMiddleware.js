const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Farmer = require('../models/farmer');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
     
      token = req.headers.authorization.split(' ')[1];
      console.log(`[AUTH] Verifying token for path: ${req.path}`);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`[AUTH] Decoded user ID: ${decoded.id}`);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error(`[AUTH] User not found for ID: ${decoded.id}`);
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      console.log(`[AUTH] User authenticated: ${req.user.name} (${req.user.role})`);
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

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log(`[AUTH] Admin access granted to: ${req.user.email}`);
    next();
  } else {
    const role = req.user ? req.user.role : 'none';
    console.warn(`[AUTH] Admin access DENIED to: ${req.user?.email} (Role: ${role})`);
    res.status(401).json({ 
      message: `Not authorized as an admin. Your role is: ${role}`,
      reason: 'role_mismatch',
      required: 'admin',
      current: role
    });
  }
};

const staff = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'staff')) {
    console.log(`[AUTH] Staff/Admin access granted to: ${req.user.email}`);
    next();
  } else {
    const role = req.user ? req.user.role : 'none';
    console.warn(`[AUTH] Staff access DENIED to: ${req.user?.email} (Role: ${role})`);
    res.status(401).json({ 
      message: `Not authorized as staff or admin. Your role is: ${role}`,
      reason: 'role_mismatch',
      required: 'staff_or_admin',
      current: role
    });
  }
};

const staffOrFarmer = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try Staff/Admin
      const user = await User.findById(decoded.id).select('-password');
      if (user && (user.role === 'admin' || user.role === 'staff')) {
        req.user = user;
        console.log(`[AUTH] Management access granted: ${user.email}`);
        return next();
      }

      // Try Farmer
      const farmer = await Farmer.findById(decoded.id).select('-password');
      if (farmer) {
        req.farmer = farmer;
        console.log(`[AUTH] Farmer access granted: ${farmer.email}`);
        return next();
      }

      res.status(401).json({ message: 'Not authorized as staff, admin or farmer' });
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

module.exports = { protect, admin, staff, staffOrFarmer };
