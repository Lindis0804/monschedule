const mongoose = require("mongoose");
const User = require("./userModel");
const { Schema, SchemaTypes, model } = mongoose;
const activitySchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
  },
  {
    collection: "activities",
    timestamps: true,
    expireAfterSeconds: 604800,
  }
);
const Activity = model("Activity", activitySchema);
Activity.updateMany(
  {},
  {
    $rename: { user: "userId" },
  },
  {
    multi: true,
  },
  (err, blocks) => {
    console.log("Done!");
  }
);
module.exports = Activity;
