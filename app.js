const express = require("express");

const router = require("./routes/taskRoute");

const app = express();

app.use(express.json());

app.use("/api/v1/tasks", router);

module.exports = app;
