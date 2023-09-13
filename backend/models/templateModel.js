const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const templateSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  background: {
    type: String,
  },
  columns: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Column",
    },
  ],
},{
    collection:"templates",
    timestamps:true
});
const templateModel = model("Template", templateSchema);
module.exports = templateModel;
