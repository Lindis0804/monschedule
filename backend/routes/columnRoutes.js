const boardController = require("../controllers/boardController");
const columnController = require("../controllers/columnController");
const validateController = require("../controllers/validateController");

const columnRouter = require("express").Router();
columnRouter.post(
    "/addCard",
    validateController.checkToken,
    validateController.checkAccessRightToColumn,
    columnController.addCard
)
columnRouter.delete(
    "/deleteCard",
    validateController.checkToken,
    validateController.checkAccessRightToCard,
    columnController.deleteCard
)
columnRouter.put(
    "/update",
    validateController.checkToken,
    validateController.checkAccessRightToColumn,
    columnController.updateColumn
)
module.exports = columnRouter