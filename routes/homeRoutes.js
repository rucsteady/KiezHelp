const router = require("express").Router(),
    homeController = require("../controllers/homeController");


router.get("/", homeController.getIndex);
module.exports = router;