const { Router } = require("express");
const Post = require("../models/post");
const { isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudanary/index"); // from cloudinary/index.js
const upload = multer({ storage });
const { show_post, Render_createform, create_post, delete_form, show_detailer } = require("../Controller/post");

const router = Router();

// Show all posts
router.get("/", show_post);

// Form to create post
router.get("/create", isLoggedIn, Render_createform);

// Handle form submit
router.post("/", isLoggedIn, upload.single("image"), create_post);

// Delete post
router.delete("/:id/delete", isLoggedIn, delete_form);

// View a single post with populated comments
router.get("/:id", show_detailer);



module.exports = router;
