const { truncate } = require("lodash");
const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
require("./workspaceModel");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    workspaces: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Workspace",
      },
    ],
    gmail: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "users",
    database: "local",
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
