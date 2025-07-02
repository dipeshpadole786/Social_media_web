const Review = require("./models/Review")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;  // Save original path to return after login
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}


module.exports.isReview = async (req, res, next) => {
    const { id, reviewId } = req.params;

    try {
        const found_review = await Review.findById(reviewId);

        if (!found_review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/post/${id}`);
        }

        if (!found_review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this review. You can't delete it.");
            return res.redirect(`/post/${id}`);
        }

        next();

    } catch (err) {
        console.error("Error in isReview middleware:", err);
        req.flash("error", "Something went wrong.");
        return res.redirect(`/listing/${id}`);
    }
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clean it after use
    } else {
        res.locals.redirectUrl = null; // Always define it
    }
    next();
}
