"use strict";

const Volunteer = require("../models/volunteer");

exports.getAllVolSubscribers = (req, res) => {
  Volunteer.find({})
    .exec()
    .then(volunteers => {
      res.render("volunteers", {
        volunteers: volunteers
      });
    })
    .catch(error => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log("promise complete");
    });
};

exports.getVolSubscriptionPage = (req, res) => {
  res.render("volunteer");
};

exports.saveVolSubscriber = (req, res) => {
  let newVolSubscriber = new Volunteer({
    name: req.body.name,
    email: req.body.email,
    zipcode: req.body.zipcode,
  });
  newVolSubscriber
    .save()
    .then((result) => {
      res.render("thanks");
    })
    .catch((error) => {
      if (error) res.send(error);
    });
};
