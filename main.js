"use strict";

const express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscribersController = require("./controllers/subscribersController"),
    usersController = require("./controllers/usersController"),
    layouts = require("express-ejs-layouts"),
    // router = express.Router(),
    expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash"),
    methodOverride = require("method-override"),
    expressValidator = require("express-validator"),
    passport = require("passport"),
    User = require("./models/user"),
    router = require("./routes/index");

const mongoose = require("mongoose");
mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://kiezhelp1:kiezhelp1@ds261479.mlab.com:61479/heroku_w4qr4v2r", {
        useNewUrlParser: true,
    }
);
const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});
mongoose.set("useCreateIndex", true);

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressValidator());

app.use(layouts);
app.use(express.static("public"));
app.use("/", router);


app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});