const userController = require("../controllers/userController");
const { checkToken } = require("../controllers/validateController");

const router = require("express").Router();
router.post("/login", userController.logIn);
router.post("/signUp", userController.signUp);
router.get("/getUser", userController.getAllUser);
router.get("/profile/id/:userId", checkToken, userController.getUserInfoById);
module.exports = router;
