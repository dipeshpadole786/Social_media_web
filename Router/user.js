const { Router } = require("express");
const User = require("../models/User.js");
const { render } = require("ejs");
const router = Router();
const passport = require("passport");
const { render_form, post_form, login_form_render, post_login_form, logOut } = require("../Controller/User.js");

router.get("/signup", render_form)
router.post("/signup", post_form)
router.get("/login", login_form_render)
router.post("/login", passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), post_login_form)
router.get("/logout", logOut);
module.exports = router;