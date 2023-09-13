const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
require("./cardModel");
const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    cards: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Card",
      },
    ],
    wallpaper: {
      type: String,
    },
    creator: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    member: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
    description:{
      type:String
    }
  },
  {
    collection: "columns",
    timestamps: true,
  }
);
const Column = model("Column", columnSchema);
module.exports = Column;
