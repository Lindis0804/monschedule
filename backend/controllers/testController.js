MONGODB_URL =
  "mongodb+srv://ledinhhieu15030804:trunghung0804@cluster0.f9lb5dh.mongodb.net/?retryWrites=true&w=majority";
JWT_SECRET_KEY = "HJDUDHSIDejhfefHEjk";
PASSWORD = "cajtpbcrrqaqrcnv";
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.MONGODB_URL);
mongoose.connect(MONGODB_URL, () => {
  console.log("Connected mongodb");
});
const testController = {
  addComment: (req, res, next) => {
    User.find({}).then((data) => {
      console.log(data);
      console.log(data.length);
      for (var i = 0; i < data.length; i++) {
        const input = {
          commenter: data[i]._id,
          comment: `Hi i'm ${data[i].Name}`,
          reactions: [0, i * 2, i * 3, undefined, i * 4],
        };
        console.log(input);
        Comment.create(input);
      }
    });
  },
};
//testController.addComment();
module.exports = testController;
