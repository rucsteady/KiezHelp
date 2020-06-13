const router = require("express").Router(),
    subscribersController = require("../controllers/subscribersController"),
    usersController = require("../controllers/usersController");

router.post(
    "/subscribe",
    subscribersController.saveAllSubscriber,
    usersController.redirectView
);
router.get("/volunteer", subscribersController.getVolSubscriptionPage);
router.get("/requester", subscribersController.getReqSubscriptionPage);
router.get("/locate/:type/:category", subscribersController.getAllSubscribers);
router.get("/admin", subscribersController.getAdmin);
router.get("/volunteers", subscribersController.getAllVolSubscribers);
router.get("/requesters", subscribersController.getAllReqSubscribers);
router.post("/delete/:type", subscribersController.deleteSubscribers);
router.post("/deleteOne/:id", subscribersController.deleteOneSubscriber);
router.post("/generateFakeData", subscribersController.saveFakeData);
module.exports = router;