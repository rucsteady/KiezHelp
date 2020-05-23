"use strict";

const User = require("../models/user");
const rp = require("request-promise");
const $ = require("cheerio");

exports.getRegister = (req, res) => {
    res.render("register", { error: '' });
};

exports.getLogin = (req, res) => {
    res.render("login", { error: '' });
};

exports.saveUser = (req, res) => {
    let newUser = new User({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        aboutMe: req.body.aboutMe,
        password: req.body.password,
    });
    newUser
        .save()
        .then(() => {
            res.render("success", { action: "REGISTER" });
            //TODO: save this ObjectId to global so I can add subscribes to the logged in user
        })
        .catch((error) => {
            console.log(error.message);
            if (error) res.render("register", { error: error.message });
        });
};

//TODO check if there's such user with the mail and correct password
exports.loginAction = (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    User.findOne({ email: req.body.email, password: req.body.password })
        .exec()
        .then((found) => {
            console.log("found:" + found);
            if (found)
                res.render("success", { action: "LOG IN" });
            else {
                res.render("login", { error: "Incorrect Input" });
            }
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};