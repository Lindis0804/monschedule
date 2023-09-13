const boardController = require("../controllers/boardController");
const validateController = require("../controllers/validateController");

const router = require("express").Router();
router.get(
  "/get/:boardId",
  validateController.checkToken,
  validateController.checkAccessRightToBoard,
  boardController.getBoardById
);
router.post(
    "/addColumn",
    validateController.checkToken,
    validateController.checkAccessRightToBoard,
    boardController.addColumn
)
router.delete(
    "/deleteColumn",
    validateController.checkToken,
    validateController.checkAccessRightToColumn,
    boardController.deleteColumn
)
router.put(
    "/updateBoard",
    validateController.checkToken,
    validateController.checkAccessRightToBoard,
    boardController.updateBoard
)
router.get("/");
module.exports = router;
