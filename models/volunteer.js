"use strict";

const mongoose = require("mongoose"),
  volunteerSchema = mongoose.Schema({
    name: String,
    zipcode: Number,
    date: { type: Date, default: Date.now },
    durafrom: String,
    durato: String,
    message: String,
  });

module.exports = mongoose.model("Volunteer", volunteerSchema);
