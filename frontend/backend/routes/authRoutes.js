const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Make sure the path is correct

// Define routes and their handlers
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authController.getUserData); // This route might require authentication

module.exports = router;
