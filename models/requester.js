"use strict";

const mongoose = require("mongoose"),
  requesterSchema = mongoose.Schema({
    name: String,
    zipcode: Number,
    date: { type: Date, default: Date.now },
    option: String,
    durafrom: String,
    durato: String,
    message: String,
  });

module.exports = mongoose.model("Requester", requesterSchema);