require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET="lamodedkekw" ;

const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticate };
