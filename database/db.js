const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err; // important: let it bubble up
  }
};

module.exports = connectDB;
