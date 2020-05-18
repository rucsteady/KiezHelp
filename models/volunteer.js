"use strict";

const mongoose = require("mongoose"),
    volunteerSchema = mongoose.Schema({
        type: String,
        name: String,
        address: String,
        date: { type: Date, default: Date.now },
        option: String,
        durafrom: String,
        durato: String,
        message: String,
    });

module.exports = mongoose.model("Volunteer", volunteerSchema);
