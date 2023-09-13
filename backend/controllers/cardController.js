const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const jwt = require("jsonwebtoken");
const { secretKey } = require("../const/Const");
const Card = require("../models/cardModel");
const Activity = require("../models/activityModel");
const Task = require("../models/taskModel");
const Comment = require("../models/commentModel");
const cardController = {
  getCardById: async (req, res, next) => {
    const { cardId } = req.data1;
    try {
      const card = await Card.findById(cardId).populate({
        path: "checkLists.tasks",
      });
      return res.status(200).json({
        success: true,
        data: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  updateCard: async (req, res, next) => {
    const { cardId, ...resData } = req.body;
    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $set: resData,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Update card successfully.",
        data: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addMember: async (req, res, next) => {
    const { cardId, isWorkspaceAdmin, isCardCreator } = req.data1;
    const { memberId } = req.body;
    try {
      if (isWorkspaceAdmin || isCardCreator) {
        const card = await Card.findByIdAndUpdate(
          cardId,
          {
            $addToSet: { members: memberId },
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          success: true,
          message: "Add member successfully.",
          data: card,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "You are not an admin or a card creator.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteMember: async (req, res, next) => {
    const { cardId, isWorkspaceAdmin, isCardCreator } = req.data1;
    const { memberId } = req.body;
    try {
      if (isWorkspaceAdmin || isCardCreator) {
        const card = await Card.findByIdAndUpdate(
          cardId,
          {
            $pull: { members: memberId },
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          success: true,
          message: "Delete member successfully.",
          data: card,
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "You are not an admin or a card creator.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addActivity: async (req, res, next) => {
    const user = req.data;
    const { cardId } = req.data1;
    const { activity } = req.body;
    try {
      const act = await Activity.create({
        user: user._id,
        activity,
      });
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $push: {
            activities: act._id,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        activity: act,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addLabel: async (req, res, next) => {
    const { cardId } = req.data1;
    const { label } = req.body;
    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $addToSet: {
            labels: label,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Add label successfully.",
        card: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteLabel: async (req, res, next) => {
    const { cardId } = req.data1;
    const { label } = req.body;
    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $pull: {
            labels: label,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Delete label successfully.",
        card: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addChecklist: async (req, res, next) => {
    const { cardId, ...resData } = req.body;
    const user = req.data;
    try {
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $push: {
            checkLists: {
              ...resData,
              creator: user._id,
            },
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Add checklist successfully.",
        card: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteChecklist: async (req, res, next) => {
    const { checkListId, cardId } = req.data1;
    try {
      //not have------------------------delete task
      const card = await Card.findByIdAndUpdate(
        cardId,
        {
          $pull: {
            checkLists: {
              _id: checkListId,
            },
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Delete checklist successfully.",
        card: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  updateChecklist: async (req, res, next) => {
    const { cardId, checkListId, ...resData } = req.body;
    console.log("checkListId", checkListId);
    console.log("resData", resData);
    try {
      const card = await Card.findById(cardId);
      const checkListIndex = card.checkLists
        .map((item) => item._id.toString())
        .indexOf(checkListId);
      console.log("card1", card);
      card.checkLists[checkListIndex] = {
        ...card.checkLists[checkListIndex],
        ...resData,
      };
      console.log("card", card);
      const newCard = await card.save();
      return res.status(200).json({
        success: true,
        message: "Update checklist successfully.",
        card: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addTask: async (req, res, next) => {
    const { cardId } = req.data1;
    const { checkListId, ...data } = req.body;
    const user = req.data;
    try {
      const card = await Card.findById(cardId);
      const task = await Task.create({
        ...data,
        creator: user._id,
      });
      const checkListIndex = card?.checkLists
        .map((item) => item._id.toString())
        .indexOf(checkListId);
      console.log(checkListIndex);
      card?.checkLists[checkListIndex]?.tasks.push(task._id);
      await card.save();
      return res.status(200).json({
        success: true,
        message: "Add task successfully.",
        card: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteTask: async (req, res, next) => {
    console.log("delete task");
    console.log(req.data1);
    const { taskId, checkListId, cardId } = req.data1;
    const card = await Card.findById(cardId);
    const checkListIndex = card?.checkLists
      .map((item) => item._id.toString())
      .indexOf(checkListId.toString());
    try {
      card.checkLists[checkListIndex].tasks.pop(taskId);
      await card.save();
      return res.status(200).json({
        success: true,
        message: "Delete task successfully.",
        card: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
};
module.exports = cardController;
