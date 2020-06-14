"use strict";

const express = require("express"),
    app = express(),
    helmet = require("helmet"),
    layouts = require("express-ejs-layouts"),
    expressValidator = require("express-validator"),
    router = require("./routes/index"),
    mongoose = require("mongoose");
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
app.set("token", process.env.TOKEN || "kiezhelpT0k3n"); //app.get("token")
app.get("token");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressValidator());
app.use(helmet());

app.use(layouts);
app.use(express.static("public"));
app.use("/", router);


const server = app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
}),
io = require("socket.io")(server);
require("./controllers/chatController")(io);