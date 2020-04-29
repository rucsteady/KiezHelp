const httpStatus = require("http-status-codes");
exports.respondNoResourceFound = (req, res) => {
  let errorCode = httpStatus.NOT_FOUND;
  res.status(errorCode);
  res.sendFile(`./public/${errorCode}.html`, {
    root: "./",
  });
};
exports.respondInternalError = (error, req, res, next) => {
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  res.status(errorCode);
  res.sendFile(`./public/${errorCode}.html`, {
    root: "./",
  });
};
