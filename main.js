"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscribersController = require("./controllers/subscribersController"),
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

app.get("/volunteers", subscribersController.getAllVolSubscribers);
app.get("/volunteer", subscribersController.getVolSubscriptionPage);
app.post("/subscribe", subscribersController.saveAllSubscriber);

app.get("/requesters", subscribersController.getAllReqSubscribers);
app.get("/requester", subscribersController.getReqSubscriptionPage);

app.get("/locate/:type/:category", subscribersController.getAllSubscribers);

app.get("/admin", subscribersController.getAdmin);
app.post("/delete/:type", subscribersController.deleteSubscribers);
app.post("/deleteOne/:id", subscribersController.deleteOneSubscriber);
app.post("/generateFakeData", subscribersController.saveFakeData);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});