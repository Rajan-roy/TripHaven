const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//signup
router.get("/signup", (req, res) => {
  res.render("users/3dlogin_signup",{ showSignup: true });
});
router.post("/signup", wrapAsync(userController.signup));

//login
router.get("/login", (req, res) => {
  res.render("users/3dlogin_signup", { showSignup: false });
});
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login", failureFlash: true
}), userController.login);
//logout
router.get ("/logout", userController.logout);

module.exports = router;