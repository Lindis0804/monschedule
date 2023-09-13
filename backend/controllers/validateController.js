const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { SchemaTypes } = mongoose;
const { secretKey } = require("../const/Const");
const Board = require("../models/boardModel");
const Card = require("../models/cardModel");
const Column = require("../models/columnModel");
const User = require("../models/userModel");
const Workspace = require("../models/workspaceModel");
const validateController = {
  checkToken: (req, res, next) => {
    console.log("check token");
    try {
      var result = jwt.verify(req.headers.token, secretKey);
      console.log("result", result);
      req.data = result;
      next();
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Your token is wrong or expired",
      });
    }
  },
  checkAccessRightToWorkSpace: async (req, res, next) => {
    const user = req.data;
    const { workspaceId } = req.body;
    try {
      const workspaces = await User.findById(user._id, "workspaces");
      var index = workspaces.workspaces.indexOf(workspaceId);
      if (index != -1) {
        next();
      } else {
        return res.status(404).json({
          success: false,
          message:
            "Workspace not found or you are not a member of this workspace.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  checkAccessRightToBoard: async (req, res, next) => {
    console.log("checkAccessRightToBoard");
    const user = req.data;
    const boardId = req.body?.boardId || req.params?.boardId;
    console.log(boardId);
    console.log("user", user);
    try {
      const workspaceId = (
        await User.findById(user._id, "workspaces").populate({
          path: "workspaces",
          select: "boards",
        })
      )?.workspaces.find((item) => item.boards.indexOf(boardId) !== -1)?._id;
      console.log("workspaceId", workspaceId);
      if (workspaceId) {
        req.data1 = {
          workspaceId: workspaceId,
          boardId: boardId,
        };
        console.log(req.data1);
        next();
      } else {
        return res.status(403).json({
          success: false,
          message:
            "Board not found or you don not have right to access this board.",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  checkAccessRightToColumn: async (req, res, next) => {
    const user = req.data;
    const columnId = req.body?.columnId || req.params?.columnId;
    req.data1 = {};
    try {
      const column = await Column.findById(columnId, "creator");
      const board = await Board.findOne({ columns: columnId }, "_id");
      if (!board)
        return res.status(404).json({
          success: false,
          message: "Board not found.",
        });
      const workspace = await Workspace.findOne(
        { boards: board._id },
        "_id admins members"
      );
      if (!workspace)
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      if (workspace.admins.indexOf(user._id) !== -1) {
        req.data1.isWorkspaceAdmin = true;
      } else if (workspace.members.indexOf(user._id) !== -1) {
        req.data1.isWorkspaceAdmin = false;
      } else
        return res.status(403).json({
          success: false,
          message: "You don't have access right to this column.",
        });
      req.data1.isColumnCreator = user._id == column.creator;
      req.data1 = {
        ...req.data1,
        workspaceId: workspace._id,
        boardId: board._id,
        columnId: columnId,
      };
      console.log(req.data1);
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  checkAccessRightToCard: async (req, res, next) => {
    try {
      const user = req.data;
      const cardId = req.body?.cardId || req.params?.cardId;
      if (!cardId)
        return res.status(403).json({
          success: false,
          message: "CardId is empty.",
        });
      const card = await Card.findById(cardId, "creator");
      req.data1 = {};
      req.data1.isCardCreator = user._id == card.creator;
      const column = await Column.findOne({ cards: cardId }, "_id");
      if (!column) {
        return res.status(404).json({
          success: false,
          message: "Column not found.",
        });
      }
      const board = await Board.findOne(
        {
          columns: column._id.toString(),
        },
        "_id"
      );
      if (!board)
        return res.status(404).json({
          success: false,
          message: "Board not found.",
        });
      const workspace = await Workspace.findOne(
        { boards: board._id },
        "_id admins members"
      );
      if (!workspace)
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      if (workspace.admins.indexOf(user._id) !== -1) {
        req.data1.isWorkspaceAdmin = true;
      } else if (workspace.members.indexOf(user._id) !== -1) {
        req.data1.isWorkspaceAdmin = false;
      } else
        return res.status(403).json({
          success: false,
          message: "You don't have access right to this column.",
        });
      req.data1 = {
        ...req.data1,
        workspaceId: workspace._id,
        boardId: board._id,
        columnId: column._id,
        cardId: cardId,
      };
      console.log(req.data1);
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  checkAccessRightToComment: async (req, res, next) => {},
  checkAccessRightToTask: async (req, res, next) => {
    const user = req.data;
    const taskId = req.body?.taskId || req.params?.taskId;
    var checkListId;
    if (!taskId)
      return res.status(400).json({
        success: false,
        message: "TaskId is empty.",
      });
    req.data1 = { taskId };
    try {
      const card = await Card.findOne({ "checkLists.tasks": taskId });
      if (!card) {
        return res.status(404).json({
          success: false,
          message: "Card not found.",
        });
      }
      const checkLists = card.checkLists;
      for (var checkList of checkLists) {
        var taskIndex = checkList.tasks
          .map((item) => item.toString())
          .indexOf(taskId);
        if (taskIndex != -1) {
          checkListId = checkList._id;
          break;
        }
      }
      req.data1.isCardCreator = user._id == card.creator;
      const column = await Column.findOne({ cards: card._id }, "_id");
      if (!column) {
        return res.status(404).json({
          success: false,
          message: "Column not found.",
        });
      }
      const board = await Board.findOne({ columns: column._id }, "_id");
      if (!board)
        return res.status(404).json({
          success: false,
          message: "Board not found.",
        });
      const workspace = await Workspace.findOne(
        { boards: board._id },
        "_id admins members"
      );
      if (!workspace)
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      if (workspace.admins.indexOf(user._id) !== -1) {
        req.data1.isWorkspaceAdmin = true;
      } else if (workspace.members.indexOf(user._id) !== -1) {
        req.data1.isWorkspaceAdmin = false;
      } else
        return res.status(403).json({
          success: false,
          message: "You don't have access right to this column.",
        });
      req.data1 = {
        ...req.data1,
        workspaceId: workspace._id,
        boardId: board._id,
        columnId: column._id,
        cardId: card._id,
        taskId: taskId,
        checkListId,
      };
      // console.log(req.data1);
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  checkAccessRightToChecklist: async (req, res, next) => {
    const user = req.data;
    const checkListId = req.body?.checkListId || req.params?.checkListId;
    if (!checkListId)
      return res.status(400).json({
        success: false,
        message: "ChecklistId is empty.",
      });
    req.data1 = {};
    try {
      const card = await Card.findOne({ "checkLists._id": checkListId });
      if (!card) {
        return res.status(404).json({
          success: false,
          message: "Card not found.",
        });
      }
      req.data1.isCardCreator = user._id == card.creator;
      const column = await Column.findOne({ cards: card._id }, "_id");
      if (!column) {
        return res.status(404).json({
          success: false,
          message: "Column not found.",
        });
      }
      const board = await Board.findOne({ columns: column._id }, "_id");
      if (!board)
        return res.status(404).json({
          success: false,
          message: "Board not found.",
        });
      const workspace = await Workspace.findOne(
        { boards: board._id },
        "_id admins members"
      );
      if (!workspace)
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      if (workspace.admins.indexOf(user._id) !== -1) {
        req.data1.isWorkspaceAdmin = true;
      } else if (workspace.members.indexOf(user._id) !== -1) {
        req.data1.isWorkspaceAdmin = false;
      } else
        return res.status(403).json({
          success: false,
          message: "You don't have access right to this column.",
        });
      req.data1 = {
        ...req.data1,
        workspaceId: workspace._id,
        boardId: board._id,
        columnId: column._id,
        cardId: card._id,
        checkListId: checkListId,
      };
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
};
module.exports = validateController;
