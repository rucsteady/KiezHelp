const router = require("express").Router(),
    apiController = require("../controllers/apiController"),
    usersController = require("../controllers/usersController");



// router.get("/userapi", apiController.userapi, apiController.respondJSON);
// router.use(apiController.errorJSON);

router.post("/api/login", usersController.apiAuthenticate);
router.use(usersController.verifyJWT);
router.use(usersController.verifyToken);
router.get("/latestRequests", usersController.latestRequests, usersController.respondJSON);
router.get("/api/user", usersController.userapi, usersController.respondJSON);
router.use(usersController.errorJSON);

module.exports = router;