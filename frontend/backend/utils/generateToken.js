const jwt = require('jsonwebtoken');

// Hardcoded JWT secret key
const JWT_SECRET = 'lamodedkekw'; // Replace with your actual secret key

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
