const validateController = require("../controllers/validateController");
const workspaceController = require("../controllers/workspaceController");
const { route } = require("./userRoutes");

const router = require("express").Router();
router.get("/", (req, res, next) => {
  return res.status(200).json("Workspace");
});
router.get("/getAll", workspaceController.getAll);
router.get(
  "/workspaces",
  validateController.checkToken,
  workspaceController.getWorkspaces
);
router.get(
  "/:workspaceId/:workspaceName",
  validateController.checkToken,
  workspaceController.getWorkspaceById
);
router.post(
  "/add",
  validateController.checkToken,
  workspaceController.addWorkspace
);
router.delete(
  "/delete/:workspaceId",
  validateController.checkToken,
  workspaceController.deleteWorkspace
);
router.put(
  "/update",
  validateController.checkToken,
  workspaceController.updateWorkspace
);
router.delete(
  "/deleteAdmin",
  validateController.checkToken,
  workspaceController.deleteAdmin
);
router.post(
  "/addAdmin",
  validateController.checkToken,
  workspaceController.addAdmin
);
router.delete(
  "/deleteMember",
  validateController.checkToken,
  workspaceController.deleteMember
);
router.post(
  "/addMember",
  validateController.checkToken,
  workspaceController.addMember
);
router.post(
  "/addBoard",
  validateController.checkToken,
  validateController.checkAccessRightToWorkSpace,
  workspaceController.addBoard
);
router.delete(
  "/deleteBoard",
  validateController.checkToken,
  validateController.checkAccessRightToBoard,
  workspaceController.deleteBoard
);
module.exports = router;
