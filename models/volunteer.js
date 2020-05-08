"use strict";

const mongoose = require("mongoose"),
  volunteerSchema = mongoose.Schema({
    name: String,
    email: String,
    zipcode: Number
  });

module.exports = mongoose.model("Volunteer", volunteerSchema);