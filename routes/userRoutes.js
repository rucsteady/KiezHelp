const router = require("express").Router(),
    usersController = require("../controllers/usersController"),
    passport = require("passport");


router.get("/latestRequests", usersController.latestRequests, usersController.respondJSON);
router.get("/api/user", usersController.userapi, usersController.respondJSON);
router.use(usersController.errorJSON);

router.get("/user", usersController.user);

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

router.get("/profile", usersController.getUserProfile);

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