const Post = require("../models/post");

module.exports.show_post = async (req, res) => {
    const data = await Post.find();
    res.render("post/index", { data });
}

module.exports.Render_createform = (req, res) => {
    res.render("post/create_form");
}

module.exports.create_post = async (req, res) => {
    try {
        const { title, description } = req.body;
        const imageUrl = req.file ? req.file.path : "";
        const post = new Post({
            title,
            description,
            image: imageUrl,
            owner: req.user._id
        });
        await post.save();
        req.flash("success", "Post created!");
        res.redirect("/post");
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to create post.");
        res.redirect("/post");
    }
}

module.exports.delete_form = async (req, res) => {
    const { id } = req.params;
    let post = await Post.findById(id);
    if (!post.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this Post. You can't delete it.");
        return res.redirect(`/post/${id}`);
    }
    await post.deleteOne();
    req.flash("success", "Post deleted!");
    res.redirect("/post");
}

module.exports.show_detailer = async (req, res) => {
    const { id } = req.params;
    const data = await Post.findById(id)
        .populate({
            path: "comment",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    res.render("post/show", { data });
}