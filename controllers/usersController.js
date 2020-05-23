"use strict";

const User = require("../models/user");
const rp = require("request-promise");
const $ = require("cheerio");

exports.getRegister = (req, res) => {
    res.render("register", { error: '' });
};

function validateEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
}

function confirmPassword(confirmPassword, password) {
    return confirmPassword.equals(password);
}
exports.saveUser = (req, res) => {
    // if (!validateEmail(req.body.email) || !validatePassword(req.body.password) || !confirmPassword(req.body.confirmPassword, req.body.password)) {

    let newUser = new User({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        aboutMe: req.body.aboutMe,
        password: req.body.password,
    });
    newUser
        .save()
        .then(() => {
            res.render("success");
            //TODO: save this ObjectId to global so i can add subscribes
        })
        .catch((error) => {
            console.log(error.message);
            if (error) res.render("register", { error: error.message });
        });
};