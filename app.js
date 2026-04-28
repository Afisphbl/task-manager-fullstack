const express = require("express");
const morgan = require("morgan");

const router = require("./routes/taskRoute");
const AppError = require("./utils/appError");
const errorController = require("./controller/errorController");

const app = express();

const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/tasks", router);

app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
