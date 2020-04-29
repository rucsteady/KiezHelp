exports.sendIndexRes = (req, res) => {
    res.render("index");
  };
  
  exports.respondWithName = (req, res) => {
    let paramsName = req.params.name;
    res.render("index", { name: paramsName });
  };
  