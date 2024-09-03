const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an instance of Express
const app = express();

// Connect to MongoDB
connectDB(); // Assuming connectDB handles your MongoDB connection

// Middleware setup
app.use(cors());
app.use(express.json()); // For parsing application/json

// Define routes
app.use('/api/auth', authRoutes); // Authentication routes (login, signup)
app.use('/api/work-orders', workOrderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export the app for deployment
module.exports = app;
