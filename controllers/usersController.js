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
    console.log("Running loginAction");
    User.findOne({ email: req.body.email, password: req.body.password })
        .exec()
        .then((user) => {
            if (user) {
                res.locals.userId = user.id;
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
    //TODO: in order for users to view the vol/req they submitted, 
    // we need to populate subscriber and pass it render so it can be shown in profile
    // atm, we can only see ID of those entries, not the entire content. Maybe we can 

    if (req.query.subs) {
        console.log("reqsbus:" + req.query.subs);
    }
    if (req.query.userId) {
        User.findOne({ _id: req.query.userId })
            .then((user) => {
                res.render('profile', { user: user });
            })
            .catch((error) => {
                //TODO: myabe we can customise all the error message so we get a better idea of what's wrong , like:
                // console.log(`Error <the purpose of this function>: ${error.message}`);
                console.log(`Error getting user profile by Id: ${error.message}`);
                return [];
            });

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
        // res.locals.alerts = alerts;
        // res.render(`/profile?userId=${userId}`, { alerts: alerts });
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
                next();
            })
            .catch(error => {
                console.log(`Error updating user by ID: ${error.message}`);
                next(error);
            });
    }
}

exports.redirectView = (req, res, next) => {
    let redirectPath = res.locals.redirect;
    console.log("in red:" + res.locals.userId);
    if (redirectPath) {
        res.redirect(url.format({
            pathname: redirectPath,
            query: {
                "userId": res.locals.userId
            }
        }));
    } else next();
}