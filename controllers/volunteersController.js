const Mongoose = require("mongoose"),
  Volunteer = require("../models/volunteer");

exports.getAllVolSubscribers = (req, res) => {
  Subscriber.find({})
    .exec()
    .then((volunteers) => {
      res.render("volunteers", {
        volunteers: volunteers,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log("promise complete");
    });
};

exports.getVolSubscriptionPage = (req, res) => {
  res.render("volunteers");
};

exports.saveVolSubscriber = (req, res) => {
  let newVolSubscriber = new Volunteer({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
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

exports.getVolunteer = (req, res) => {
  res.render("volunteer");
};


