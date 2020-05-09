"use strict";

const Volunteer = require("../models/volunteer");
const Requester = require("../models/requester");

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
    zipcode: req.body.zipcode,
    message: req.body.message,
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


exports.getAllReqSubscribers = (req, res) => {
  Requester.find({})
    .exec()
    .then(requesters => {
      res.render("requesters", {
        requesters: requesters
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

exports.getReqSubscriptionPage = (req, res) => {
  res.render("requester");
};

exports.saveReqSubscriber = (req, res) => {
  let newReqSubscriber = new Requester({
    name: req.body.name,
    zipcode: req.body.zipcode,
    message: req.body.message,
  });
  newReqSubscriber
    .save()
    .then((result) => {
      res.render("thanks");
    })
    .catch((error) => {
      if (error) res.send(error);
    });
};
