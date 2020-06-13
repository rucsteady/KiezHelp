const router = require("express").Router(),
    usersController = require("../controllers/usersController");
expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"),
    methodOverride = require("method-override"),
    expressValidator = require("express-validator"),
    passport = require("passport"),
    User = require("../models/user");

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

router.get("/register", usersController.getRegister);
router.post(
    "/createUser",
    usersController.validate,
    usersController.createUser,
    usersController.redirectView
);
router.get("/login", usersController.getLogin);
router.get("/loginFirst", usersController.loginFirst, usersController.redirectView);

router.post("/login", passport.authenticate('local', {
    failureRedirect: "/login",
    failureFlash: "Email or password invalid.",
    successRedirect: "/",
    successFlash: "You have successfully logged in!"
}), usersController.authenticate, usersController.redirectView);

router.get("/logout", usersController.logout, usersController.redirectView);


// router.post(
//     "/subscribe",
//     subscribersController.saveAllSubscriber,
//     usersController.redirectView
// );
router.get("/profile", usersController.getUserProfile);

// router.use(
//     methodOverride("_method", {
//         methods: ["POST", "GET"],
//     })
// );
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

module.exports = router;