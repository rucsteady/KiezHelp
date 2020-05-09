"use strict";

const mongoose = require("mongoose"),
  volunteerSchema = mongoose.Schema({
    name: String,
    zipcode: Number,
    message: String
  });

module.exports = mongoose.model("Volunteer", volunteerSchema);