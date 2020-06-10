"use strict";

const User = require("../models/user"),
  Subscriber = require("../models/subscriber"),
  rp = require("request-promise"),
  $ = require("cheerio"),
  url = require("url"),
  session = require("express-session");
exports.getRegister = (req, res) => {
  res.render("register", { error: "" });
};

exports.getLogin = (req, res) => {
  res.render("login", { error: "" });
};

exports.createUser = (req, res, next) => {
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
  User.create(newUser)
    .then((user) => {
      req.flash("success", `${user.id}'s account created successfully!`);
      res.locals.userId = user.id;
      res.locals.alerts = [];
      res.locals.redirect = "/profile";
      next();
    })
    .catch((error) => {
      console.log(`Error saving user: ${error.message}`);
      res.locals.redirect = "/";
      req.flash(
        "error",
        `Failed to create user account because: ${error.message}.`
      );
      next();
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

  User.update(
    { _id: userId },
    {
      $currentDate: {
        dateEdited: true,
      },
      $set: {
        address: newAddress,
        email: newEmail,
        password: newPassword,
        aboutMe: newAboutMe,
        name: {
          first: newFirstName,
          last: newLastName,
        },
      },
    }
  )
    .then((user) => {
      console.log("user:" + user);
      res.locals.alerts = [];
      res.locals.redirect = "/profile";
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
        res.locals.redirect = "/profile";
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

//exchange loginAction to this to add vol/req with a certain user account
exports.loginToVol = (req, res, next) => {
  console.log("Running loginToVol");
  User.findOne({ email: req.body.email, password: req.body.password })
    .exec()
    .then((user) => {
      if (user) {
        res.locals.userId = user.id;
        res.locals.alerts = [];
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

  if (req.query.subs) {
    console.log("reqsbus:" + req.query.subs);
  }
  if (req.query.userId) {
    User.findOne({ _id: req.query.userId })
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
              alerts: req.query.alerts,
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
};

//using update method from Unit4 to update profile info( except subscribers part)
exports.updateUser = (req, res, next) => {
  console.log("Running user update");
  const userId = req.params.userId;
  res.locals.userId = userId;

  const newFirstName = req.body.firstName,
    newLastName = req.body.lastName,
    newAddress = req.body.address,
    newEmail = req.body.email,
    newPassword = req.body.password,
    newAboutMe = req.body.aboutMe;
  //we want to show the user why their change isn't saved, so we use alerts array to store error msg from validations that didn't pass
  let alerts = [];
  alerts.push("");
  //regex same as user.js
  var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //usual email regex
  var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; //regex for password with minimum eight characters, at least one letter, one number and one special character
  //if didn't pass test, push to alerts and reload profile with no changes updated
  if (!emailRegex.test(newEmail) || !passwordRegex.test(newPassword)) {
    if (!emailRegex.test(newEmail))
      alerts.push("Please provide a valid email address");
    if (!passwordRegex.test(newPassword))
      alerts.push(
        "Password must have at least eight characters, at least one letter, one number and one special character"
      );

    res.locals.redirect = "/profile";
    res.locals.alerts = alerts;
    next();
  } else {
    //if passed validations, update profile
    User.findByIdAndUpdate(userId, {
      // using $currentDate to update dateEdited as doing this: dateEdited: Date.now doesn't work
      // you can find look up on $currentDate from MongoDB
      $currentDate: {
        dateEdited: true,
      },
      $set: {
        address: newAddress,
        email: newEmail,
        password: newPassword,
        aboutMe: newAboutMe,
        name: {
          first: newFirstName,
          last: newLastName,
        },
      },
    })
      .then((user) => {
        res.locals.redirect = "/profile";
        res.locals.alerts = alerts;
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  }
};

//Unit 4 delete
exports.deleteSub = (req, res, next) => {
  console.log("Running deleteSub");
  const userId = req.params.userId,
    subId = req.body.subId;
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
      res.locals.alerts = [];
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
  const userId = req.params.userId;
  console.log("userId:" + userId);
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
  if (redirectPath) {
    res.redirect(
      url.format({
        pathname: redirectPath,
        query: {
          userId: res.locals.userId,
          alerts: res.locals.alerts,
        },
      })
    );
  } else next();
};
