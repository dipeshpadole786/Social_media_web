
const User = require("../models/User")
module.exports.render_form = (req, res) => {
    res.render("user/signup");
}

module.exports.post_form = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let new_User = new User({
            email,
            username,
        });
        let user = await User.register(new_User, password);
        console.log(user);

        // login user after registration
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            return res.redirect("/post");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.login_form_render = (req, res) => {
    res.render("user/login");
}

module.exports.post_login_form = (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/post");
}

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/post");
    })
}