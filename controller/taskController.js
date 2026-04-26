exports.getTasks = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Get all task",
  });
};

exports.getTask = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    message: `Get task with id ${id}`,
  });
};

exports.createTask = (req, res) => {
  res.status(201).json({
    status: "success",
    message: `create task`,
  });
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    message: `Update task with id ${id}`,
  });
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: "success",
    message: `Delete task with id ${id}`,
  });
};
