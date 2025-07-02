const { Router } = require("express");
const Post = require("../models/post.js");
const { isLoggedIn, isReview } = require("../middleware.js");
const Review = require("../models/Review.js")
const { add_review, delete_review } = require("../Controller/Review.js")

const router = Router();

// Route to add a review to a post
router.post("/:id/review", isLoggedIn, add_review);

// Route to delete a review
router.delete("/:id/review/:reviewID", isLoggedIn, delete_review);

module.exports = router;
