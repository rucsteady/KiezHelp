exports.sendReqParam = (req, res) => {
    let paramsType = req.params.type;
    let paramsCat = req.params.category;
    res.render("locate", { type: paramsType, category: paramsCat });
};

exports.respondWithName = (req, res) => {
    let paramsName = req.params.name;
    res.render("index", { name: paramsName });
};

exports.logErrors = (error, req, res, next) => {
    console.error(error.stack);
    next(error);
};

exports.respondWithPage = (req, res) => {
    // console.log(req.params.page);
    res.render(`${req.params.page}`);
};