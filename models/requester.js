"use strict";

const mongoose = require("mongoose"),
  requesterSchema = mongoose.Schema({
    name: String,
    zipcode: Number,
    message: String
  });

module.exports = mongoose.model("Requester", requesterSchema);