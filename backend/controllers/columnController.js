const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const jwt = require("jsonwebtoken");
const { secretKey } = require("../const/Const");
const Card = require("../models/cardModel");
const Column = require("../models/columnModel");
const columnController = {
  addCard: async (req, res, next) => {
    const { columnId } = req.data1;
    const { title } = req.body;
    const user = req.data;
    try {
      const card = await Card.create({
        title,
        creator: user._id,
      });
      const column = await Column.findByIdAndUpdate(
        columnId,
        {
          $push: {
            cards: card._id,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Add card successfully.",
        card: card,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteCard: async (req, res, next) => {
    const { cardId, columnId, isCardCreator, isWorkspaceAdmin } = req.data1;
    try {
      if (isCardCreator || isWorkspaceAdmin) {
        //not have------------------------delete comment, task
        await Card.findByIdAndDelete(cardId);
        await Column.findByIdAndUpdate(columnId, {
          $pull: {
            cards: cardId,
          },
        });
        return res.status(200).json({
          success: true,
          message: "Delete card successfully.",
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "You have no right to delete this card.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  updateColumn: async (req, res, next) => {
    const { columnId,...resData} = req.body;
    try {
      const column = await Column.findByIdAndUpdate(
        columnId,
        {
          $set: resData,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Update column successfully.",
        data:column
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
};
module.exports = columnController;
