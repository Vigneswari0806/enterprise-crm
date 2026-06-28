const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
      ssl: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err.message);
    console.log("Falling back to local MongoDB...");
    try {
      await mongoose.connect("mongodb://localhost:27017/crm");
      console.log("Local MongoDB connected");
    } catch (err2) {
      console.error("Local MongoDB error:", err2.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
