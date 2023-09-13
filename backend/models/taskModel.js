const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  members: [
    {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  dueDate: {
    type: Date,
    default:new Date(Date.now()+172800000)
  },
  done: {
    type: Boolean,
    default:false
  },
  creator: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  destroy:{
    type:Boolean,
    default:false
  }
});
const Task = model("Task", taskSchema);
module.exports = Task;
