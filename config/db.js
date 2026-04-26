const mongoose = require("mongoose");

const DATABASE_HOST = process.env.DATABASE_HOST;

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_HOST);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
