"use strict";

const User = require("../models/user"),
    Subscriber = require("../models/subscriber"),
    rp = require("request-promise"),
    $ = require("cheerio"),
    url = require("url"),
    session = require("express-session"),
    bcrypt = require("bcrypt"),
    httpStatus = require("http-status-codes");


exports.latestRequests = (req, res, next) => {
    let subArray;
    console.log("running latestRequests in userscontroller");
    Subscriber.find().sort({ 'dateCreated': -1 }).limit(5).then(
        item => {
            res.json(item);
        }
    );
};

exports.userapi = (req, res) => {
    console.log("running userapi in userscontroller");
    res.json(res.locals.currentUser);
    next();
};

exports.respondJSON = (req, res) => {
    console.log("running respondJson");
    res.json({
        status: httpStatus.OK,
        data: res.locals
    });
};

exports.errorJSON = (error, req, res, next) => {
    console.log("running errorJson");
    let errorObject;
    if (error) {
        errorObject = {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error.message
        };
    } else {
        errorObject = {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Unknown Error."
        };
    }
    res.json(errorObject);
};

exports.user = (req, res) => {
    // Change the res.render("courses/index") line in the indexView action
    res.json(res.locals.currentUser);
};

exports.getRegister = (req, res) => {
    res.render("register");
};

exports.getLogin = (req, res) => {
    res.render("login");
};

exports.loginFirst = (req, res, next) => {
    req.flash("error", "You must log in first before making request/volunteer.");
    res.locals.redirect = "/login";
    next();
};

exports.logout = (req, res, next) => {
    req.logout();
    req.flash("success", "You have successfully logged out!");
    res.locals.redirect = "/";
    next();
};


exports.createUser = (req, res, next) => {
    if (req.skip) next();
    let newUser = {
        name: {
            first: req.body.firstName,
            last: req.body.lastName,
        },
        address: req.body.address,
        email: req.body.email,
        aboutMe: req.body.aboutMe,
        password: req.body.password,
    };

    User.register(newUser, req.body.password, (error, user) => {
        if (user) {
            req.flash("success", `${user.name.first}'s account created successfully!`);
            res.locals.redirect = "/login";
            next();
        } else {
            console.log(`Error saving user: ${error.message}`);
            res.locals.redirect = "/register";
            req.flash("error", `Failed to create user account because ${error.message}.`);
            next();
        }
    });
};

exports.validate = (req, res, next) => {
    req.sanitizeBody("email").normalizeEmail({
        all_lowercase: true
    }).trim();
    //check email
    req.check("email", "Email is invalid").notEmpty().isEmail();
    //check password
    req.check("password", "Password has to be at least 8 char").isLength({ min: 8 });
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then((error) => {
        if (!error.isEmpty()) {
            let messages = error.array().map(e => e.msg);
            req.skip = true;
            req.flash("error", messages.join(" and "));
            res.locals.redirect = "/register";
            next();
        } else {
            next();
        }
    });
}


//TODO check if there's such user with the mail and correct password
exports.authenticate = (req, res, next) => {
    console.log("Running authentication");
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                user.passwordComparison(req.body.password)
                    .then(passwordsMatch => {
                        if (passwordsMatch) {
                            req.flash("success", `Hi, ${user.fullname()}. You logged in successfully!`);
                            res.locals.user = user;
                            res.locals.redirect = "/"; //"/profile";
                        } else {
                            req.flash("error", "Failed to log in user account: Incorrect Password.");
                            res.locals.redirect = "/login";
                        }
                        next();
                    });
            } else {
                req.flash("error", "Failed to log in user account: User account not found.");
                res.locals.redirect = "/login";
                next();
            }
        })
        .catch((error) => {
            console.log(`Error login action: ${error.message}`);
            return [];
        });
};

//exchange loginAction to this to add vol/req with a certain user account
exports.loginToVol = (req, res, next) => {
    console.log("Running loginToVol");
    User.findOne({ email: req.body.email, password: req.body.password })
        .exec()
        .then((user) => {
            if (user) {
                res.locals.redirect = `/volunteer/${user.id}`;
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
    if (req.query.format === "json") {
        res.json(res.locals.currentUser);
    } else {

        if (req.query.subs) {
            console.log("reqsubs:" + req.query.subs);
        }
        // if (req.query.userId) {
        if (res.locals.currentUser) {
            User.findOne({ _id: res.locals.currentUser._id })
                .exec()
                .then((user) => {
                    //getting the full detail info of subscribers that have userId that matches this user
                    let subsArray = [];
                    Subscriber.find({ userId: user._id })
                        .exec()
                        .then((subs) => {
                            subs.forEach((sub) => {
                                subsArray.push(sub);
                            });
                        })
                        .catch((error) => {
                            console.log(`Error getting subs by userId: ${error.message}`);
                            return [];
                        })
                        .then(() => {
                            res.render("profile", {
                                user: user,
                                subs: subsArray,
                            });
                        });
                })
                .catch((error) => {
                    console.log(`Error getting user profile by Id: ${error.message}`);
                    return [];
                });
        } else {
            res.render("profile", { user: "" });
        }
    }
};

//using update method from Unit4 to update profile info( except subscribers part)
exports.updateUser = (req, res, next) => {
    console.log("Running user update");
    const userId = res.locals.currentUser._id,
        newFirstName = req.body.firstName,
        newLastName = req.body.lastName,
        newAddress = req.body.address,
        newEmail = req.body.email,
        newAboutMe = req.body.aboutMe;
    let newPassword = req.body.password;

    //we want to show the user why their change isn't saved, so we use alerts array to store error msg from validations that didn't pass
    let flashString = [];

    //regex same as user.js
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //usual email regex
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; //regex for password with minimum eight characters, at least one letter, one number and one special character
    //if didn't pass test, push to alerts and reload profile with no changes updated
    if (!emailRegex.test(newEmail) || !passwordRegex.test(newPassword)) {
        if (!emailRegex.test(newEmail)) {
            flashString += "Please provide a valid email address. ";
        }
        if (!passwordRegex.test(newPassword)) {
            flashString += "Password must have at least eight characters, at least one letter, one number and one special character.";
        }
        if (flashString.length > 0) {
            req.flash("error", flashString);
        }
        res.locals.redirect = "/profile";
        next();
    } else {
        //if passed validations, update profile
        //hash password 
        bcrypt.hash(newPassword, 10).then(hash => {

                User.findByIdAndUpdate(userId, {
                        // using $currentDate to update dateEdited as doing this: dateEdited: Date.now doesn't work
                        // you can find look up on $currentDate from MongoDB
                        $currentDate: {
                            dateEdited: true,
                        },
                        $set: {
                            address: newAddress,
                            email: newEmail,
                            password: hash,
                            aboutMe: newAboutMe,
                            name: {
                                first: newFirstName,
                                last: newLastName,
                            },
                        },
                    })
                    .then((user) => {
                        res.locals.redirect = "/profile";
                        next();
                    })
                    .catch((error) => {
                        console.log(`Error updating user by ID: ${error.message}`);
                        next(error);
                    });


            })
            .catch(error => {
                console.log(`Error in hashing password: ${error.message}`);
            });


    }
};

//Unit 4 delete
exports.deleteSub = (req, res, next) => {
    console.log("Running deleteSub");
    const subId = req.body.subId;
    let userId = '';
    if (res.locals.currentUser) {
        userId = res.locals.currentUser._id;
    }
    //first delete it from subscriber, then delete from user
    Subscriber.findByIdAndRemove(subId)
        .then()
        .catch((error) => {
            console.log(`Error deleting in Sub by subId: ${error.message}`);
            next(error);
        });
    User.findOne({ _id: userId })
        .then((user) => {
            user.subscribers = user.subscribers.filter((sub) => {
                sub != subId;
            });
            user.save();
            res.locals.userId = userId;
            res.locals.redirect = "/profile";
            next();
        })
        .catch((error) => {
            console.log(`Error deleting in User by subId: ${error.message}`);
            next(error);
        });
};

//if we delete a user, we also need to delete the subscribers that relates to them
exports.deleteUser = (req, res) => {
    console.log("Running deleteUser");
    let userId = '';
    if (res.locals.currentUser) {
        userId = res.locals.currentUser._id;
    }

    //first delete subscribers, then delete the user

    Subscriber.deleteMany({ userId: userId })
        .then()
        .catch((error) => {
            console.log(`Error removing subs with this userId: ${error.message}`);
        });
    console.log("here");
    User.findByIdAndRemove(userId)
        .then(() => {
            console.log("in update here");
            res.render("register", { error: "" });
        })
        .catch((error) => {
            console.log(`Error deleting user by Id: ${error.message}`);
        });
};

exports.redirectView = (req, res, next) => {
    let redirectPath = res.locals.redirect;
    // console.log("in red:" + res.locals.userId);
    let userId = '';
    if (res.locals.currentUser) {
        userId = res.locals.currentUser._id;
    }
    if (redirectPath) {
        res.redirect(
            url.format({
                pathname: redirectPath
            })
        );
    } else next();
};