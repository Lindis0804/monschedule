const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const commentSchema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    replies: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],
    reactions: [
      {
        type: {
          emoji: {
            type: SchemaTypes.ObjectId,
            ref: "Emoji",
          },
          numOfReaction: Number,
        },
      },
    ],
    creator: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    replied: {
      type: SchemaTypes.ObjectId,
      ref: "Comment",
    },
    repliedUser: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "comments",
  }
);
const Comment = model("Comment", commentSchema);
module.exports = Comment;
