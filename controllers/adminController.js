//move admin stuff in here, so u can manage both req/vol and user data

// "use strict";

// const User = require("../models/user");
// const rp = require("request-promise");
// const $ = require("cheerio");

// exports.getRegister = (req, res) => {
//     res.render("register", { error: '' });
// };

// exports.getLogin = (req, res) => {
//     res.render("login", { error: '' });
// };

// exports.loginAction = (req, res) => {
//     // res.render("login", { error: '' });
//     res.render("success");
// };

// exports.saveUser = (req, res) => {
//     let newUser = new User({
//         name: req.body.name,
//         address: req.body.address,
//         email: req.body.email,
//         aboutMe: req.body.aboutMe,
//         password: req.body.password,
//     });
//     newUser
//         .save()
//         .then(() => {
//             res.render("success");
//             //TODO: save this ObjectId to global so i can add subscribes
//         })
//         .catch((error) => {
//             console.log(error.message);
//             if (error) res.render("register", { error: error.message });
//         });
// };
// //TODO check if there's such user with the mail and correct password
// // exports.getAllReqSubscribers = (req, res) => {
// //     Subscriber.find({ type: "Request" })
// //         .exec()
// //         .then((volunteers) => {
// //             res.render("showEachCategory", {
// //                 volunteers: volunteers,
// //                 type: "Request",
// //             });
// //         })
// //         .catch((error) => {
// //             console.log(error.message);
// //             return [];
// //         })
// //         .then(() => {
// //             console.log("promise complete");
// //         });
// // };