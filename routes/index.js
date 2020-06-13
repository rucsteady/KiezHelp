const router = require("express").Router(),
    userRoutes = require("./userRoutes"),
    subscriberRoutes = require("./subscriberRoutes"),
    errorRoutes = require("./errorRoutes"),
    homeRoutes = require("./homeRoutes"),
    express = require("express"),
    app = express(),
    expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"),
    methodOverride = require("method-override"),
    expressValidator = require("express-validator"),
    passport = require("passport"),
    User = require("../models/user");


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

router.use(
    methodOverride("_method", {
        methods: ["POST", "GET"],
    })
);

router.use("/", userRoutes);
router.use("/", subscriberRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;