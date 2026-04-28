const Task = require("../model/taskModels");
const Features = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getTasks = catchAsync(async (req, res) => {
  const features = new Features(Task.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const tasks = await features.query;

  res.status(200).json({
    status: "success",
    result: tasks.length,
    data: {
      tasks,
    },
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) return next(new AppError("Task not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.createTask = catchAsync(async (req, res, next) => {
  const newTask = await Task.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      task: newTask,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) return next(new AppError("Task not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);

  if (!task) return next(new AppError("Task not found", 404));

  res.status(204).end();
});
