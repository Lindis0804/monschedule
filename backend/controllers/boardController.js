const Board = require("../models/boardModel");
const Column = require("../models/columnModel");
const User = require("../models/userModel");

const boardController = {
  getBoardById: async (req, res, next) => {
    console.log("getBoardById");
    const { boardId } = req.params;
    try {
      const data = await Board.findById(boardId).populate({
        path: "columns",
        populate: {
          path: "cards",
          populate: {
            path: "members",
            select: "_id avatar",
          },
        },
      });
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addColumn: async (req, res, next) => {
    console.log("addColumn");
    const { title, wallpaper, boardId } = req.body;
    const user = req.data;
    try {
      const column = await Column.create({
        title,
        wallpaper,
        creator: user._id,
      });
      const board = await Board.findByIdAndUpdate(
        boardId,
        {
          $push: {
            columns: column._id,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        data: column,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteColumn: async (req, res, next) => {
    const {
      isWorkspaceAdmin,
      isColumnCreator,
      workspaceId,
      boardId,
      columnId,
    } = req.data1;
    try {
      if (isWorkspaceAdmin || isColumnCreator) {
        //not have--------------------------------------delete card
        await Column.findByIdAndDelete(columnId);
        await Board.findByIdAndUpdate(boardId, {
          $pull: {
            columns: columnId,
          },
        });
        return res.status(200).json({
          success: true,
          message: "Delete column successfully.",
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "You have no right to delete this column.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  updateBoard: async (req, res, next) => {
    const {boardId,...resData} = req.body
    try {
      const board = await Board.findByIdAndUpdate(
        boardId,
        {
          $set: resData,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message:"Update board successfully.",
        data: board,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
};
module.exports = boardController;
