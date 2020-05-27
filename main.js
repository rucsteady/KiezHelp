"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscribersController = require("./controllers/subscribersController"),
    usersController = require("./controllers/usersController"),
    layouts = require("express-ejs-layouts"),
    router = express.Router(),
    methodOverride = require("method-override");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://kiezhelp1:kiezhelp1@ds261479.mlab.com:61479/heroku_w4qr4v2r", {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});
mongoose.set("useCreateIndex", true);


app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.use("/", router);
router.get("/register", usersController.getRegister);
router.post("/createUser", usersController.createUser, usersController.redirectView);
router.get("/login", usersController.getLogin);
router.post("/loginAction", usersController.loginAction, usersController.redirectView);
//only for adding vol/req under a certain user account
router.post("/loginToVol", usersController.loginToVol, usersController.redirectView);

router.post("/saveProfileEdit", usersController.saveProfileEdit, usersController.redirectView);

router.post("/subscribe", subscribersController.saveAllSubscriber, usersController.redirectView);
router.get("/profile", usersController.getUserProfile);

//put
router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));
router.put("/users/:userId/update", usersController.updateUser, usersController.redirectView);
router.delete("/users/:userId/delete", usersController.delete, usersController.redirectView);
router.put("/users/:subId/update", usersController.updateSub, usersController.redirectView);

app.get("/", homeController.getIndex);

//fill out form
app.get("/volunteer/:userId", subscribersController.getVolSubscriptionPage);
app.get("/requester/:userId", subscribersController.getReqSubscriptionPage);

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