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
            res.locals.userId = user.id;
            res.locals.redirect = '/profile';
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


exports.saveProfileEdit = (req, res, next) => {

    const userId = req.body.userId,
        newFirstName = req.body.firstName,
        newLastName = req.body.lastName,
        newAddress = req.body.address,
        newEmail = req.body.email,
        newPassword = req.body.password,
        newAboutMe = req.body.aboutMe,
        newDateEdited = Date.now;

    User.update({ _id: userId }, {
            $currentDate: {
                dateEdited: true
            },
            $set: {
                address: newAddress,
                email: newEmail,
                password: newPassword,
                aboutMe: newAboutMe,
                name: {
                    first: newFirstName,
                    last: newLastName
                }
            }
        })
        .then((user) => {
            console.log("user:" + user);
            res.locals.redirect = '/profile';
            res.locals.userId = req.body.userId;
            next();
        })
        .catch((error) => {
            if (error) res.send(error);
        })
        .then(() => {
            console.log("promise complete");
        });
    //     } else {
    //         res.locals.redirect = '/profile';
    //         res.locals.userId = req.body.userId;
    //         next();
    //     }
    // })
    // .catch((error) => {
    //     if (error) res.send(error);
    // })
    // .then(() => {
    //     console.log("promise complete");
    // });

};

//TODO check if there's such user with the mail and correct password
exports.loginAction = (req, res, next) => {
    User.findOne({ email: req.body.email, password: req.body.password })
        .exec()
        .then((user) => {
            if (user) {
                res.locals.userId = user.id;
                res.locals.redirect = '/profile';
                next();
                // res.locals.redirect = '/';
                // res.render("success", { action: "LOG IN" });
            } else {
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
exports.getUserProfile = (req, res) => {
    //TODOpopulate subscriber and pass it to render so it cna be shown in profile
    //TODO also need to add edit posibility for update
    if (req.query.subs) {
        console.log("reqsbus:" + req.query.subs);
    }
    if (req.query && req.query.userId) {
        User.findOne({ _id: req.query.userId })
            .then((user) => {
                res.render('profile', { user: user });
            })
            .catch((error) => {
                console.log(error.message);
                return [];
            });

    } else {
        res.render('profile', { user: '' });
    }
};
exports.redirectView = (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
        // res.redirect(redirectPath);
        res.redirect(url.format({
            pathname: redirectPath,
            query: {
                "userId": res.locals.userId
            }
        }));
    } else next();
}