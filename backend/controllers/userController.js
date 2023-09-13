const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Const = require("../const/Const");
const lodash = require("lodash");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const config = require("../config.js");
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook_api_key,
      clientSecret: config.facebook_api_secret,
      callbackURL: config.callback_url,
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        if (config.use_database) {
          User.find({ _id: profile.id }).then((data) => {
            if (data && data.length == 0) {
              console.log("There is no such user, adding now");
              User.save(
                lodash.pick(
                  {
                    _id: profile.id,
                    user_name: profile.username,
                  },
                  ["_id", "Username"]
                )
              );
            } else {
              console.log("Username exists");
            }
          });
        }
        return done(null, profile);
      });
    }
  )
);
const userController = {
  logIn: async (req, res) => {
    if (req.body) {
      console.log("userController.logIn.req.body: ", req.body);
      const { username, password } = req.body;
      var data = {
        username: username,
        password: password,
      };
      console.log(data);
      User.findOne(data)
        .then((data) => {
          if (data) {
            var token = jwt.sign({ _id: data._id }, Const.secretKey);
            return res.status(200).json({
              success: true,
              token: token,
            });
          } else {
            return res.status(200).json({
              success: false,
              message: "Log in fail",
            });
          }
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: err,
          });
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "Empty body",
      });
    }
  },
  signUp: async (req, res) => {
    const { username, password, gmail, name } = req.body;
    if ([username, password, gmail, name].some((item) => item === undefined)) {
      return res.status(404).json({
        success: false,
        message: "Username or password or gmail not found.",
      });
    }
    try {
      const userByUsernames = await User.find({
        username: username,
      });
      if (userByUsernames.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Username exist.",
        });
      }
      const userByGmails = await User.find({
        gmail: gmail,
      });
      if (userByGmails.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Gmail exist.",
        });
      }
      const user = await User.create({
        username,
        password,
        gmail,
        name,
      });
      return res.status(200).json({
        success: true,
        message: "Sign up successfully.",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Sign up fail.",
        err: err,
      });
    }
  },
  getAllUser: async (req, res, next) => {
    try {
      var token = req.headers.token;
      var result = jwt.verify(token, Const.secretKey);
      if (result) {
        User.find({})
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        return res.status(403).json({
          message: "Your token is wrong or expired",
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: err,
      });
    }
  },
  getUserInfoById: async (req, res, next) => {
    const user = req.data;
    const { userId } = req.params;
    var userInfo = {};
    try {
      if (user._id === userId) {
        userInfo = await User.findById(user._id, {
          username: 0,
          password: 0,
        });
      } else {
        userInfo = await User.findById(userId, {
          username: 0,
          password: 0,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Get user info by id successfully.",
        data: userInfo,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Get user info by id fail.",
        err: err,
      });
    }
  },

  signUpWithGoogle: async (req, res, next) => {},
  changeInfomation: async (req, res, next) => {},
  authenticateWithFacebook: async (req, res, next) => {},
  getUserInformationIfLogInFacebookSuccessfully: async (req, res, next) => {},
  logOutFacebook: async (req, res, next) => {},
};
module.exports = userController;
