const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'lamodedkekw';
const authController = require('../controllers/authController'); // Make sure the path is correct



// Define routes and their handlers
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authController.getUserData); // This route might require authentication
router.get('/generate-token', (req, res) => {
  try {
    console.log('JWT_SECRET:', JWT_SECRET); // Log the secret to check if it's loaded
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const payload = { userId: '12345' }; // Replace with actual user data
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'Error generating token', error: error.message });
  }
});

/*http://localhost:5000/api/auth/login*/
/*http://localhost:5000/api/auth/register*/

module.exports = router;
