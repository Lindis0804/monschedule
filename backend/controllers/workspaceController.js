const Board = require("../models/boardModel");
const Column = require("../models/columnModel");
const User = require("../models/userModel");
const Workspace = require("../models/workspaceModel");
const workspaceController = {
  getWorkspaces: async (req, res, next) => {
    const result = req.data;
    try {
      const data = await User.find({ _id: result._id }, "workspaces").populate(
        { path: "workspaces" }
        // "title",
        // "description",
        // "wallpaper",
        // "member"
      );
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (err) {
      res.status(403).json({
        success: false,
        message: err,
      });
    }
  },
  getWorkspaceById: async (req, res, next) => {
    var workspaceId = req.params.workspaceId;
    const result = req.data;
    console.log(result);
    User.findOne({ _id: result._id }, "workspaces").then(async (data) => {
      if (data?.workspaces.indexOf(workspaceId) != -1) {
        try {
          const workspace = await Workspace.findOne({
            _id: workspaceId,
          }).populate({
            path: "boards",
            select: "_id title wallpaper",
          });
          return res.status(200).json({
            success: true,
            data: workspace,
          });
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: err,
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this workspace",
        });
      }
    });
  },
  addWorkspace: async (req, res, next) => {
    const body = req.body;
    var result = req.data;
    try {
      const admins = body.admins ? [result._id, ...body.admins] : [result._id];
      const { title, description, members, wallpaper } = body;
      const workspace = new Workspace({
        title,
        description,
        members,
        admins,
        wallpaper,
      });
      await workspace.save();
      console.log(workspace);
      admins.forEach(async (element) => {
        x = await User.findOneAndUpdate(
          { _id: element },
          {
            $push: { workspaces: workspace._id },
          }
        );
        console.log(x);
      });
      body.members?.forEach(async (element) => {
        x = await User.findOneAndUpdate(
          { _id: element },
          {
            $push: { workspaces: workspace._id },
          }
        );
        console.log(x);
      });
      return res.status(200).json({
        success: true,
        data: workspace,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteWorkspace: async (req, res, next) => {
    const workspaceId = req.params.workspaceId;
    var user = req.data;
    const ws = await Workspace.findOne(
      { _id: workspaceId },
      "admins members boards"
    );
    if (ws) {
      if (ws.admins.indexOf(user._id) != -1) {
        try {
          //not have============================delete boards
          ws.admins.forEach(async (item) => {
            const x = await User.findByIdAndUpdate(item, {
              $pull: { workspaces: workspaceId },
            });
          });
          ws.members.forEach(async (item) => {
            const x = await User.findByIdAndUpdate(item, {
              $pull: { workspaces: workspaceId },
            });
          });
          const deleteResult = await Workspace.findByIdAndDelete(workspaceId);
          return res.status(200).json({
            success: true,
            message: "Delete workspace successfully.",
          });
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: err,
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: "You are not an admin of this workspace.",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Workspace not found.",
      });
    }
  },
  updateWorkspace: async (req, res, next) => {
    var { workspaceId, ...data } = req.body;
    var user = req.data;
    try {
      await Workspace.findByIdAndUpdate(workspaceId, data);
      return res.status(200).json({
        success: true,
        message: "Update workspace successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteAdmin: async (req, res, next) => {
    const { workspaceId, adminId } = req.body;
    var user = req.data;
    try {
      const workspace = await Workspace.findOne({
        _id: workspaceId,
      });
      if (workspace) {
        var isAdmin = workspace.admins.indexOf(user._id);
        if (isAdmin != -1) {
          var index = workspace.admins.indexOf(adminId);
          if (index != -1) {
            workspace.admins.splice(index, 1);
            workspace.members.push(adminId);
            await workspace.save();
            return res.status(200).json({
              success: true,
              message: "Delete admin successfully.",
            });
          } else {
            return res.status(404).json({
              success: false,
              message: "Admin not found.",
            });
          }
        } else {
          return res.status(403).json({
            success: false,
            message: "You are not an admin of this workspace.",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addAdmin: async (req, res, next) => {
    const { workspaceId, adminId } = req.body;
    var user = req.data;
    try {
      const workspace = await Workspace.findOne({
        _id: workspaceId,
      });
      if (workspace) {
        var isAdmin = workspace.admins.indexOf(user._id);
        if (isAdmin != -1) {
          var isMember = workspace.members.indexOf(adminId);
          if (isMember == -1) {
            var adminIndex = workspace.admins.indexOf(adminId);
            if (adminIndex == -1) {
              workspace.admins.push(adminId);
              await User.findByIdAndUpdate(adminId, {
                $push: {
                  workspaces: workspaceId,
                },
              });
              await workspace.save();
              return res.status(200).json({
                success: true,
                message: "Add admin successfully.",
              });
            } else {
              return res.status(403).json({
                success: false,
                message: "Admin already existed.",
              });
            }
          } else {
            workspace.members.splice(isMember, 1);
            workspace.admins.push(adminId);
            await workspace.save();
            return res.status(200).json({
              success: true,
              message: "Add admin successfully.",
            });
          }
        } else {
          return res.status(403).json({
            success: false,
            message: "You are not an admin of this workspace.",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteMember: async (req, res, next) => {
    const { workspaceId, memberId } = req.body;
    var user = req.data;
    try {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        var isAdmin = workspace.admins.indexOf(user._id);
        if (isAdmin != -1) {
          var isMember = workspace.members.indexOf(memberId);
          if (isMember != -1) {
            workspace.members.splice(isMember, 1);
            await workspace.save();
            await User.findByIdAndUpdate(memberId, {
              $pull: {
                workspaces: workspaceId,
              },
            });
            return res.status(200).json({
              success: true,
              message: "Delete member successfully.",
            });
          } else {
            var adminIndex = workspace.admins.indexOf(memberId);
            if (adminIndex != -1) {
              workspace.admins.splice(adminIndex, 1);
              await workspace.save();
              await User.findByIdAndUpdate(memberId, {
                $pull: {
                  workspaces: workspaceId,
                },
              });
              return res.status(200).json({
                success: true,
                message: "Delete member successfully.",
              });
            } else {
              return res.status(404).json({
                success: false,
                message: "Member not found.",
              });
            }
          }
        } else {
          return res.status(403).json({
            success: false,
            message: "You are not an admin of this workspace.",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addMember: async (req, res, next) => {
    const { workspaceId, memberId } = req.body;
    var user = req.data;
    try {
      const workspace = await Workspace.findById(workspaceId);
      if (workspace) {
        var isAdmin = workspace.admins.indexOf(user._id);
        if (isAdmin != -1) {
          if (
            workspace.admins.indexOf(memberId) == -1 &&
            workspace.members.indexOf(memberId) == -1
          ) {
            workspace.members.push(memberId);
            await User.findByIdAndUpdate(memberId, {
              $push: {
                workspaces: workspaceId,
              },
            });
            await workspace.save();
            return res.status(200).json({
              success: true,
              message: "Add member successfully.",
            });
          } else {
            return res.status(403).json({
              success: false,
              message: "Member already existed.",
            });
          }
        } else {
          return res.status(403).json({
            success: false,
            message: "You are not an admin of this workspace.",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "Workspace not found.",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  getAll: async (req, res, next) => {
    try {
      const data = await Workspace.find({});
      return res.status(200).json({
        success: true,
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  addBoard: async (req, res, next) => {
    const { workspaceId, title, background } = req.body;
    const user = req.data;
    try {
      const board = await Board.create({
        title,
        background,
        creator: user._id,
      });
      await Workspace.findByIdAndUpdate(workspaceId, {
        $push: { boards: board._id },
      });
      return res.status(200).json({
        success: true,
        data: board,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
  deleteBoard: async (req, res, next) => {
    const { boardId, workspaceId } = req.data1;
    const user = req.data;
    try {
      const workspace = await Workspace.findById(workspaceId, "admins boards");
      const adminIndex = workspace.admins.indexOf(user._id);
      const board = await Board.findById(boardId, "columns creator");
      if (adminIndex === -1 && board.creator != user._id) {
        return res.status(403).json({
          success: false,
          message: "You don't have permissions to delete this board.",
        });
      }
      await Board.findByIdAndDelete(boardId);
      await Workspace.findByIdAndUpdate(workspaceId, {
        $pull: {
          boards: boardId,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Delete board successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  },
};
module.exports = workspaceController;
