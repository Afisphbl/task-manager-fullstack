const express = require("express");
const morgan = require("morgan");

const router = require("./routes/taskRoute");

const app = express();

const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/tasks", router);

module.exports = app;
