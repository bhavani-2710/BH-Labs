const mongoose = require("mongoose");

/**
 * connectDB
 * Establishes a connection to MongoDB using the URI defined in the MONGODB_URI
 * environment variable. Exits the process with code 1 on failure so that the
 * container/process manager can restart the service.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;