const { curry } = require("lodash");
const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const cardSchema = new Schema(
  {
    wallpaper: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    notifications: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    activities: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Activity",
      },
    ],
    labels: [
      {
        type: String,
      },
    ],
    members: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],
    checkLists: [
      {
        _id: {
          type: SchemaTypes.ObjectId,
          auto: true,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        tasks: [
          {
            type: SchemaTypes.ObjectId,
            ref: "Task",
          },
        ],
        creator: {
          type: SchemaTypes.ObjectId,
          ref: "User",
        },
        numOfDoneTask: {
          type: Number,
        },
      },
    ],
    numOfComment: {
      type: Number,
      default: 0,
    },
    numOfActivity: {
      type: Number,
      default: 0,
    },
    numOfTask: {
      type: Number,
      default: 0,
    },
    numOfDoneTask: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
    creator: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    numOfDoneCheckList: {
      type: Number,
    },
    numOfCheckList: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "cards",
  }
);
cardSchema.index(
  {
    activities: 1,
  },
  {
    expireAfterSeconds: 10368000,
  }
);
const Card = model("Card", cardSchema);
module.exports = Card;
