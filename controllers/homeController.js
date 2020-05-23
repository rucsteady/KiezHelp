// exports.sendReqParam = (req, res) => {
//     let paramsType = req.params.type;
//     let paramsCat = req.params.category;
//     res.render("locate", { type: paramsType, category: paramsCat });
// };

// exports.logErrors = (error, req, res, next) => {
//     console.error(error.stack);
//     next(error);
// };

exports.getIndex = (req, res) => {
    if (res.locals && res.locals.user) {
        res.render('index', { currentUser: res.locals.user });
    } else {
        res.render('index', { currentUser: '' });
    }
};