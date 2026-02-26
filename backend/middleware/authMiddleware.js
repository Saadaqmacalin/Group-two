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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find in User collection first
      req.user = await User.findById(decoded.id).select('-password');

      // If not found in User, check Farmer collection
      if (!req.user) {
        req.user = await Farmer.findById(decoded.id).select('-password');
        if (req.user) {
          console.log(`[AUTH] Farmer identity detected: ${req.user.email}`);
        }
      }

      if (!req.user) {
        console.error(`[AUTH] No identity found in any collection for ID: ${decoded.id}`);
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      console.log(`[AUTH] Request authenticated as: ${req.user.email} (Role: ${req.user.role})`);
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
  if (req.user && (req.user.role.toLowerCase() === 'admin')) {
    console.log(`[AUTH] Admin access granted to: ${req.user.email}`);
    next();
  } else {
    const role = req.user ? req.user.role : 'none';
    console.warn(`[AUTH] Admin access DENIED to: ${req.user?.email} (Detected Role: ${role})`);
    res.status(401).json({ 
      message: `Not authorized as an admin. Your role is: ${role}`,
      reason: 'role_mismatch',
      required: 'admin',
      current: role
    });
  }
};

const staff = (req, res, next) => {
  const userRole = req.user?.role?.toLowerCase() || 'none';
  if (req.user && (userRole === 'admin' || userRole === 'staff' || userRole === 'farmer')) {
    console.log(`[AUTH] Authorized access granted to: ${req.user.email} (${userRole})`);
    next();
  } else {
    console.warn(`[AUTH] Access DENIED to: ${req.user?.email} (Role: ${userRole})`);
    res.status(401).json({ 
      message: `Not authorized. Your role is: ${userRole}. Only staff, admin or verified farmers allowed.`,
      reason: 'role_mismatch',
      current: userRole
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
