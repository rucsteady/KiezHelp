"use strict";

const User = require("../models/user");
const rp = require("request-promise");
const $ = require("cheerio");
const url = require('url');
exports.getRegister = (req, res) => {
    res.render("register", { error: '' });
};

exports.getLogin = (req, res) => {
    res.render("login", { error: '' });
};

exports.createUser = (req, res, next) => {
    let newUser = {
        name: {
            first: req.body.firstName,
            last: req.body.lastName
        },
        address: req.body.address,
        email: req.body.email,
        aboutMe: req.body.aboutMe,
        password: req.body.password,
    };
    User.create(newUser)
        .then((user) => {
            res.locals.user = user;
            // res.redirect('/');
            res.locals.redirect = '/';
            next();
            // res.locals.redirect = '/';
            // res.render("index", { currentUser: res.locals.user });
            // res.render("success", { action: "REGISTER" });
            //TODO: save this ObjectId to global so I can add subscribes to the logged in user
        })
        .catch((error) => {
            console.log(error.message);
            if (error) res.render("register", { error: error.message });
        });
};

//TODO check if there's such user with the mail and correct password
exports.loginAction = (req, res, next) => {
    User.findOne({ email: req.body.email, password: req.body.password })
        .exec()
        .then((user) => {
            if (user) {
                res.locals.user = user;
                // res.redirect('/');
                res.locals.redirect = '/';
                next();
                // res.locals.redirect = '/';
                // res.render("success", { action: "LOG IN" });
            } else {
                // res.redirect(url.format({
                //     pathname: "/login",
                //     query: {
                //         "error": "Incorrect_Input"
                //     }
                // }));
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

exports.redirectView = (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
}