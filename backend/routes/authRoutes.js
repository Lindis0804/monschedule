const passport = require("passport");
const express = require("express");
const router = express.Router();
const path = require('path')
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
  };
router.get("/", (req, res) => {
  res.render(path.join(__dirname,"../views/index.ejs"));
});
router.get("/profile", isLoggedIn, (req, res) => {
  res.render(path.join(__dirname,"../views/profile.ejs"), {
    user: req.user,
  });
});
router.get("/error", isLoggedIn, (req, res) => {
  res.render(path.join(__dirname,"../views/error.ejs"));
});
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/error",
  })
);
router.get("/logout", (req, res) => {
  res.redirect("/");
});
module.exports = router;
