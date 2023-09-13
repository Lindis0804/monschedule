const taskController = require("../controllers/taskController");
const { checkToken } = require("../controllers/validateController");

const taskRouter = require("express").Router();
taskRouter.put("/update", checkToken, taskController.updateTask);
taskRouter.put("/tick", checkToken, taskController.tickTask);
module.exports = taskRouter;
