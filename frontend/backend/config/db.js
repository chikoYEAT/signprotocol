const mongoose = require('mongoose');
require('dotenv').config(); // Make sure this is at the top of the file

const MONGO_URI = "mongodb+srv://chikoyeat:chikoyeat@signprotocol.jlyy7.mongodb.net/your_database_name"

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
