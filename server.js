const dotenv = require("dotenv")
dotenv.config({path: "./config.env"});

const express = require("express");
const connectDB = require("./config/db");
const Task = require("./model/task");

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Create a new task
const testTask = new Task({
  title: "Test Task",
  description: "This is a test task",
});

testTask
  .save()
  .then(() => console.log("Test task created"))
  .catch((err) => console.error("Error creating test task:", err));

// Routes
app.use("/api/tasks", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}, connected to MongoDB ${process.env.DATABASE_HOST}`,
  );
});
