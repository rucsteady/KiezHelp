const express = require("express"),
    app = express(),
    router = require("express").Router(),
    homeController = require("../controllers/homeController"),
    expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"),
    methodOverride = require("method-override"),
    expressValidator = require("express-validator"),
    passport = require("passport"),
    User = require("../models/user");

// app.set("view engine", "ejs");
// app.set("port", process.env.PORT || 3000);
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(expressValidator());

// // app.use(layouts);
// app.use(express.static("public"));
// app.use("/", router);

// router.use(cookieParser("secret_passcode"));
// router.use(
//     expressSession({
//         secret: "secret_passcode",
//         cookie: {
//             maxAge: 4000000,
//         },
//         resave: false,
//         saveUninitialized: false,
//     })
// );

// router.use(passport.initialize());
// router.use(passport.session());
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser())
// router.use(connectFlash());

// router.use((req, res, next) => {
//     res.locals.flashMessages = req.flash();
//     res.locals.userId = '';
//     res.locals.loggedIn = req.isAuthenticated();
//     res.locals.currentUser = req.user;
//     next();
// });

router.get("/", homeController.getIndex);
module.exports = router;