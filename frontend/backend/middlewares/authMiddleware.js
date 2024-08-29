const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Hardcoded JWT secret key
const JWT_SECRET = 'lamodedkekw'; // Replace with your actual secret key

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authenticate, authorize };
