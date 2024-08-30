const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes'); // Import workOrder routes here
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
