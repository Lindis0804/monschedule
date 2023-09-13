const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
require("./boardModel");
require("./columnModel");
require("./cardModel");
require("./activityModel");
require("./userModel");
const workspaceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength:1
    },
    wallpaper: {
      type: String
    },
    description:{
      type:String
    },
    admins: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    members: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    boards: [                                                  
      {
        type: SchemaTypes.ObjectId,
        ref: "Board",
        required: false,
      },
    ],
    starred:{
      type:Boolean,
      default:false
    }
  },
  {
    collection: "workspaces",
    timestamps: true,
  }
);
const Workspace = model("Workspace", workspaceSchema);
module.exports = Workspace;
