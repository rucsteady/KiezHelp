const router = require("express").Router(),
    homeController = require("../controllers/homeController");


router.get("/", homeController.getIndex);
router.get("/chat", homeController.chat);

module.exports = router;