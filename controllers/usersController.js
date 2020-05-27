"use strict";

const User = require("../models/user"),
    Subscriber = require("../models/subscriber"),
    rp = require("request-promise"),
    $ = require("cheerio"),
    url = require('url'),
    session = require('express-session');
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
            res.locals.alerts = [];
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
            res.locals.alerts = [];
            res.locals.redirect = '/profile';
            res.locals.userId = req.body.userId;
            next();
        })
        .catch((error) => {
            if (error) res.send(error);
        });

};

//TODO check if there's such user with the mail and correct password
exports.loginAction = (req, res, next) => {
    console.log("Running loginAction");
    User.findOne({ email: req.body.email, password: req.body.password })
        .exec()
        .then((user) => {
            if (user) {
                res.locals.userId = user.id;
                res.locals.alerts = [];
                res.locals.redirect = '/profile';
                next();
            } else {
                res.render("login", { error: "Incorrect Input" });
            }
        })
        .catch((error) => {
            console.log(`Error login action: ${error.message}`);
            return [];
        });
};


exports.getUserProfile = (req, res) => {
    console.log("Running getUserProfile");

    if (req.query.subs) {
        console.log("reqsbus:" + req.query.subs);
    }
    if (req.query.userId) {
        User.findOne({ _id: req.query.userId })
            .then((user) => {
                //getting the full detail info of subscribers that have userId that matches this user
                let subs = [];
                subs.push({
                    "_id": "5ece74614f8417cbaa6ce009",
                    "type": "Volunteer",
                    "name": "test01",
                    "address": "Königsweg 314B",
                    "option": "GroceryShopping",
                    "message": "",
                    "userId": "5eccf78d20ce6e0efa52c7e1",
                    "date": null,
                    "durafrom": "",
                    "durato": "",
                    "__v": 0
                });
                Subscriber.find({ userId: req.query.userId })
                    .then((subscribers) => {
                        console.log("subs in find:" + subscribers);
                        subs.push(subscribers);
                        console.log("subbbs:" + subs);
                    })
                    .catch((error) => {
                        console.log(`Error getting subs entered by a certain user: ${error.message}`);
                        return [];
                    });

                //pass subs to profile so we can show them in view
                res.render('profile', { user: user, alerts: req.query.alerts, subs: subs });
            })
            .catch((error) => {
                console.log(`Error getting user profile by Id: ${error.message}`);
                return [];
            });
        console.log("in if userId");

    } else {
        res.render('profile', { user: '' });
    }
};

//using update method from Unit4 to update profile info( except subscribers part)
exports.update = (req, res, next) => {
    console.log("Running update");
    const userId = req.params.userId;
    res.locals.userId = userId;

    const newFirstName = req.body.firstName,
        newLastName = req.body.lastName,
        newAddress = req.body.address,
        newEmail = req.body.email,
        newPassword = req.body.password,
        newAboutMe = req.body.aboutMe;
    console.log("userId in update:" + userId);
    //we want to show the user why their change isn't saved, so we use alerts array to store error msg from validations that didn't pass
    let alerts = [];
    alerts.push('');
    //regex same as user.js 
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //usual email regex
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; //regex for password with minimum eight characters, at least one letter, one number and one special character
    //if didn't pass test, push to alerts and reload profile with no changes updated
    if (!emailRegex.test(newEmail) || !passwordRegex.test(newPassword)) {
        if (!emailRegex.test(newEmail))
            alerts.push('Please provide a valid email address');
        if (!passwordRegex.test(newPassword))
            alerts.push('Password must have at least eight characters, at least one letter, one number and one special character');

        res.locals.redirect = '/profile';
        res.locals.alerts = alerts;
        next();
    } else {
        //if passed validations, update profile
        User.findByIdAndUpdate(userId, {
                // using $currentDate to update dateEdited as doing this: dateEdited: Date.now doesn't work
                // you can find look up on $currentDate from MongoDB
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

                res.locals.redirect = '/profile';
                res.locals.alerts = alerts;
                next();
            })
            .catch(error => {
                console.log(`Error updating user by ID: ${error.message}`);
                next(error);
            });
    }
}

//Unit 4 delete
exports.delete = (req, res, next) => {
    console.log("Running delete");
    const userId = req.params.userId,
        subId = req.body.subId;
    console.log("subId:" + subId);
    console.log("userId:" + userId);
    //first delete it from subscriber, then delete from user
    Subscriber.findByIdAndRemove(subId)
        .then()
        .catch(error => {
            console.log(`Error deleting in Sub by subId: ${error.message}`);
            next(error);
        });
    console.log("in first");
    User.findOne({ _id: userId })
        .then((user) => {
            console.log("innnn");
            console.log("user:" + user);
            console.log("user:" + user.name);
            console.log("user:" + user.subscribers);
            user.subscribers = user.subscribers.filter((sub) => { sub != subId });
            user.save();
            res.locals.userId = userId;
            res.locals.redirect = '/profile';
            res.locals.alerts = [];
            next();
        })
        .catch(error => {
            console.log(`Error deleting in User by subId: ${error.message}`);
            next(error);
        });
}

exports.redirectView = (req, res, next) => {
    let redirectPath = res.locals.redirect;
    // console.log("in red:" + res.locals.userId);
    if (redirectPath) {
        res.redirect(url.format({
            pathname: redirectPath,
            query: {
                "userId": res.locals.userId,
                'alerts': res.locals.alerts
            }
        }));
    } else next();
}