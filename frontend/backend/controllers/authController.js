const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


// Hardcoded JWT secret key
const JWT_SECRET = 'lamodedkekw'; // Replace with your actual secret key

// Register a new user
exports.register = async (req, res) => {
  const { username, password, role, adminUsername } = req.body;

  try {

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
      role,
      adminUsername: adminUsername || null
    });

    await user.save();

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send the response
    res.status(201).json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate username error' });
    }
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Authenticate a user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find all users by username
    const users = await User.find({ username });

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Iterate through all users with the same username and check credentials
    for (const user of users) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Generate a JWT token
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
      }
    }

    // If no passwords matched
    return res.status(400).json({ message: 'Invalid credentials' });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: { id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
