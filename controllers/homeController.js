exports.sendReqParam = (req, res) => {
  let paramsType = req.params.type;
  let paramsCat = req.params.category;
  res.render("locate", { type: paramsType, category: paramsCat });
};

exports.logErrors = (error, req, res, next) => {
  console.error(error.stack);
  next(error);
};

exports.getIndex = (req, res) => {
  res.render("index");
};

exports.getRequester = (req, res) => {
  res.render("requester");
};

// exports.respondWithPage = (req, res) => {
  // console.log(req.params.page);
//  res.render(`${req.params.page}`);
//};
