MONGODB_URL =
  "mongodb+srv://ledinhhieu15030804:trunghung0804@cluster0.f9lb5dh.mongodb.net/?retryWrites=true&w=majority";
JWT_SECRET_KEY = "HJDUDHSIDejhfefHEjk";
PASSWORD = "cajtpbcrrqaqrcnv";
const { reject } = require("lodash");
const mongoose = require("mongoose");
const Card = require("../models/cardModel");
mongoose.connect(MONGODB_URL, () => {
  console.log("Connected mongodb");
});
const Comment = require("../models/commentModel");
var findComment = async (id) => {  
  const comment = await Comment.findOne({ _id: id });
  if (comment) {
    const replies = comment.replies;
    if (replies) {
      const numOfReply = await Promise.resolve(
        replies.reduce(async (acc, cur, index) => {
          const t = await findComment(cur);
          const data = await Promise.resolve(acc);
          return Promise.resolve(t + data);
        }, Promise.resolve(0))
      );
      return 1 + numOfReply;
    } else {
      return 1;
    }
  } else {
    return 0;
  }
};
var comments = async (t) => {
  const comments = await findComment(t);
  console.log(comments);
};
comments("639ae824581b6b971eac5a99");
// const comment = findComment("639a1f301f1acb5dac81a7a4").then(res=>res.data)
// console.log("get comment",comment)

/*
var findComment1 = async (id)=>{
  const comment = await Comment.find({_id:id})
  return comment;
}
*/
// const comment = await findComment1("639a1f301f1acb5dac81a7a4");
// console.log("comment ", comment);
// findComment("639a1f301f1acb5dac81a7a4").then((data) => {
//   console.log("data", data);
// });
/*
findComment2("639a1f301f1acb5dac81a7a4")
console.log(findComment1("639a1f301f1acb5dac81a7a4"));
const test = {
  getNumOfComment: async (id) => {
    const card = await Card.findOne({ _id: id });
    const comments = card.comments;
    if (comments) {
      console.log("comment", comments);
      await card.updateOne({
        $set: {
          numOfComment: comments.reduce((acc, cur, index) => {
            acc += findComment(cur);
            console.log("acc",acc)
            return acc
          }, 0),
        },
      });
    } else {
      await card.updateOne({
        $set: {
          numOfComment: 0,
        },
      });
    }
  },
  getNumOfActivity: async (id) => {
    const card = await Card.findOne({ _id: id });
    const activities = card.activities;
    console.log(activities);
    if (activities != null)
      await card.updateOne({ $set: { numOfActivity: activities.length } });
    else await card.updateOne({ $set: { numOfActivity: 0 } });
  },
  getNumOfTask: async (id) => {
    const card = await Card.findOne({ _id: id });
    const tasks = card.tasks;
    console.log("tasks", tasks);
    if (tasks) {
      const numOfDoneTask = tasks.reduce((acc, cur, index) => {
        if (cur.done) acc++;
      }, 0);
      await card.updateOne({
        $set: {
          numOfDoneTask: numOfDoneTask,
          numOfTask: tasks.length,
        },
      });
    } else {
      await card.updateOne({
        $set: {
          numOfDoneTask: 0,
          numOfTask: 0,
        },
      });
    }
  },
  getNumOfDoneTask: (id) => {},
};
Card.find({}, "_id").then((data) => {
  data.map((i) => {
    test.getNumOfActivity(i);
  });
});
Card.find({}, "_id").then((data) => {
  data.map((i) => {
    test.getNumOfTask(i);
  });
});
Card.find({}, "_id").then((data) => {
  data.map((i) => {
    test.getNumOfComment(i);
  });
});
module.exports = test;
*/
