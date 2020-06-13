"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscribersController = require("./controllers/subscribersController"),
    usersController = require("./controllers/usersController"),
    layouts = require("express-ejs-layouts"),
    router = express.Router(),
    expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"),
    methodOverride = require("method-override"),
    expressValidator = require("express-validator"),
    passport = require("passport"),
    User = require("./models/user");

const mongoose = require("mongoose");
mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://kiezhelp1:kiezhelp1@ds261479.mlab.com:61479/heroku_w4qr4v2r", {
        useNewUrlParser: true,
    }
);
const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});
mongoose.set("useCreateIndex", true);

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressValidator());

app.use(layouts);
app.use(express.static("public"));
app.use("/", router);

router.use(cookieParser("secret_passcode"));
router.use(
    expressSession({
        secret: "secret_passcode",
        cookie: {
            maxAge: 4000000,
        },
        resave: false,
        saveUninitialized: false,
    })
);
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())
router.use(connectFlash());

router.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.userId = '';
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

router.get("/register", usersController.getRegister);
router.post(
    "/createUser",
    usersController.validate,
    usersController.createUser,
    usersController.redirectView
);
router.get("/login", usersController.getLogin);
router.get("/loginFirst", usersController.loginFirst,  usersController.redirectView);

router.post("/login", passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: "Failed to login.",
    successRedirect: "/",
    successFlash: "Logged in!"
}), usersController.authenticate, usersController.redirectView);
//only for adding vol/req under a certain user account

router.get("/logout", usersController.logout, usersController.redirectView);

// router.post(
//     "/saveProfileEdit",
//     usersController.saveProfileEdit,
//     usersController.redirectView
// );

router.post(
    "/subscribe",
    subscribersController.saveAllSubscriber,
    usersController.redirectView
);
router.get("/profile", usersController.getUserProfile);

//put
router.use(
    methodOverride("_method", {
        methods: ["POST", "GET"],
    })
);
router.put(
    "/users/:userId/update",
    usersController.updateUser,
    usersController.redirectView
);
router.delete("/users/:userId/delete", usersController.deleteUser);
router.delete(
    "/subscribers/:userId/delete",
    usersController.deleteSub,
    usersController.redirectView
);

app.get("/", homeController.getIndex);

//fill out form
app.get("/volunteer", subscribersController.getVolSubscriptionPage);
app.get("/requester", subscribersController.getReqSubscriptionPage);

//save form input
// app.post("/subscribe", subscribersController.saveAllSubscriber);

//view entries on map
app.get("/locate/:type/:category", subscribersController.getAllSubscribers);

//view and modify db
app.get("/admin", subscribersController.getAdmin);
app.get("/volunteers", subscribersController.getAllVolSubscribers);
app.get("/requesters", subscribersController.getAllReqSubscribers);
app.post("/delete/:type", subscribersController.deleteSubscribers);
app.post("/deleteOne/:id", subscribersController.deleteOneSubscriber);
app.post("/generateFakeData", subscribersController.saveFakeData);

//error
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});