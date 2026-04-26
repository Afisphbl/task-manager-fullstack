const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DATABASE_HOST = process.env.DATABASE_HOST;

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_HOST);

    console.log("🎉🎉🎉🎉 Server connected to MongoDB successfully. 🎉🎉🎉🎉");
  } catch (error) {
    console.error(`🔥🔥🔥🔥 Error : ${error.message}. 🔥🔥🔥🔥`);
  }
};

module.exports = connectDB;
