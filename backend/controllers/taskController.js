const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const jwt = require("jsonwebtoken");
const { secretKey } = require("../const/Const");
const Task = require("../models/taskModel");
const taskController = {
  updateTask: async (req, res, next) => {
    const { taskId, title } = req.body;
    if ([taskId, title].some((item) => item === undefined)) {
      return res.status(404).json({
        success: false,
        message: "TaskId or title not found.",
      });
    }
    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        {
          $set: {
            title: title,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Update task successfully.",
        data: task,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Update task fail.",
        err: err,
      });
    }
  },
  tickTask: async (req, res, next) => {
    const { taskId } = req.body;
    if (taskId === undefined) {
      return res.status(404).json({
        success: false,
        message: "TaskId not found.",
      });
    }
    try {
      const task = await Task.findById(taskId);
      task.done = !task.done;
      task.save();
      return res.status(200).json({
        success: true,
        message: "Check task successfully.",
        data: task,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Check task fail.",
        err: err,
      });
    }
  },
};
module.exports = taskController;
