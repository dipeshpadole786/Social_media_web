const Post = require("../models/post")
const Review = require("../models/Review")
module.exports.add_review = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            req.flash("error", "Post not found!");
            return res.redirect("/post");
        }

        const new_review = new Review(req.body.review);
        new_review.author = await req.user._id;
        await new_review.save();

        // Assuming the field in Post model is "comments"
        post.comment.push(new_review);
        await post.save();

        req.flash("success", "Review added!");
        res.redirect(`/post/${id}`);
    } catch (err) {
        console.error("Error adding review:", err);
        req.flash("error", "Something went wrong while adding the review.");
        res.redirect("/post");
    }
}
module.exports.delete_review = async (req, res) => {
    let { id, reviewID } = req.params;
    console.log(id, reviewID);
    const review = await Review.findById(reviewID);
    console.log(review);
    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this review. You can't delete it.");
        return res.redirect(`/post/${id}`);
    } else {
        await Post.findByIdAndUpdate(id, { $pull: { comments: reviewID } });
        await Review.findByIdAndDelete(reviewID);
        req.flash("success", "Review deleted!");
        res.redirect(`/post/${id}`);
    }

}