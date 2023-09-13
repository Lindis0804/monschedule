const Activity = require("../models/activityModel");
const Card = require("../models/cardModel");

const activityController = {
  addActivity: async (req, res, next) => {
    const { cardId, title } = req.body;
    try {
      const act = await Activity.create({
        title,
      });
      const card = await Card.findByIdAndUpdate(cardId, {
        $addToSet: {
          activities: act._id,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Add activity fail",
        err: err,
      });
    }
  },
};
module.exports = activityController;
