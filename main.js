"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscribersController = require("./controllers/subscribersController"),
    usersController = require("./controllers/usersController"),
    layouts = require("express-ejs-layouts");

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

app.get("/", homeController.getIndex);
app.get("/register", usersController.getRegister);
app.get("/login", usersController.getLogin);
app.post("/loginAction", usersController.loginAction);
app.post("/saveUser", usersController.saveUser);

//fill out form
app.get("/volunteer", subscribersController.getVolSubscriptionPage);
app.get("/requester", subscribersController.getReqSubscriptionPage);

//save form input
app.post("/subscribe", subscribersController.saveAllSubscriber);

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