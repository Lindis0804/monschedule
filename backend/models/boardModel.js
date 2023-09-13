const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
require("./columnModel")
const boardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  columns: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Column",
    },
  ],
  background:{
    type:String
  },
  creator:{
    type:SchemaTypes.ObjectId,
    ref:"User",
    required:true
  },
  member:{
    type:SchemaTypes.ObjectId,
    ref:"User",
    required:false
  }
},{
    collection:'boards',
    timestamps:true
});
const Board = model("Board", boardSchema);
module.exports = Board;
