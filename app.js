require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const ejsMate = require("ejs-mate");

// Models & Routes
const User = require("./models/User");
const Post = require("./models/post");
const userRoutes = require("./Router/user");
const postRoutes = require("./Router/post");
const reviewRoute = require("./Router/review");
const { isLoggedIn } = require("./middleware");

const app = express();
const port = process.env.PORT || 3000;

// ✅ MongoDB Connection
const dbUrl = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ View Engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Method Override
app.use(methodOverride("_method"));

// ✅ Static Files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Session Store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET || 'devSecret', // ✅ fixed typo
    },
    touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", (err) => {
    console.log("❌ Error in Mongo session store", err);
});

// ✅ Session Config
app.use(session({
    store,
    secret: process.env.SESSION_SECRET || 'devSecret', // ✅ fixed typo
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
    }
}));

// ✅ Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Flash
app.use(flash());

// ✅ Global Middleware for views
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.message = req.flash("success");
    res.locals.message_error = req.flash("error");
    next();
});

// ✅ Routes
app.use("/", userRoutes);
app.use("/post", postRoutes);
app.use("/post", reviewRoute);

// ✅ Pages
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/mypost", isLoggedIn, async (req, res) => {
    const user = res.locals.currUser;
    const posts = await Post.find({ owner: user.id }).populate("owner").populate("comment");
    res.render("user/show_userPost", { data: posts });
});

app.get("/profile", isLoggedIn, async (req, res) => {
    const user = res.locals.currUser;
    const posts = await Post.find({ owner: user.id }).populate("owner").populate("comment");
    res.render("user/profile", { data: posts });
});

// ✅ Start Server
app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
