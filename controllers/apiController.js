// "use strict";
// const httpStatus = require("http-status-codes");

// exports.userapi = (req, res) => {
//     console.log("running userapi in apicon");
//     res.json(res.locals.currentUser);
//     next();
// };

// exports.respondJSON = (req, res) => {
//     console.log("running respondJson");
//     res.json({
//         status: httpStatus.OK,
//         data: res.locals
//     });
// };

// exports.errorJSON = (error, req, res, next) => {
//     console.log("running errorJson apicon");
//     let errorObject;
//     if (error) {
//         errorObject = {
//             status: httpStatus.INTERNAL_SERVER_ERROR,
//             message: error.message
//         };
//     } else {
//         errorObject = {
//             status: httpStatus.INTERNAL_SERVER_ERROR,
//             message: "Unknown Error."
//         };
//     }
//     res.json(errorObject);
// };