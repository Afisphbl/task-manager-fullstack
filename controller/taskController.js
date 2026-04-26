const Task = require("../model/taskModels");

exports.getTasks = async (req, res) => {
  try {
    // 1) Filtering
    const excludedQuery = ["page", "sort", "fields", "limit"];
    const allowedFields = ["title", "description", "completed", "createdAt"];

    const sanitize = (val) => {
      if (val === null || typeof val !== "object") return val;
      const out = Array.isArray(val) ? [] : {};
      for (const [k, v] of Object.entries(val)) {
        if (k.startsWith("$")) continue; // drop Mongo operators
        out[k] = sanitize(v);
      }
      return out;
    };

    const queryObj = {};
    for (const [k, v] of Object.entries(req.query)) {
      if (excludedQuery.includes(k)) continue;
      if (!allowedFields.includes(k)) continue; // whitelist filter fields
      queryObj[k] = sanitize(v);
    }

    let query = Task.find(queryObj);

    // 2) Sort
    if (typeof req.query.sort === "string") {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 3) Field
    if (typeof req.query.fields === "string") {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) Pagination
    const MAX_LIMIT = 100;
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const rawLimit = Number.parseInt(req.query.limit, 10) || 10;
    const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const tasks = await query;

    res.status(200).json({
      status: "success",
      result: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (error) {
    const status = error.name === "CastError" ? 400 : 500;
    res.status(status).json({
      status: status === 500 ? "error" : "fail",
      message: error.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        task: newTask,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(204).end();
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
