exports.sendIndexRes = (req, res) => {
    res.render("index");
  };
  
  exports.respondWithName = (req, res) => {
    let paramsName = req.params.name;
    res.render("index", { name: paramsName });
  };

  exports.respondToVol = (req, res) => {
      res.render("volunteer");
  }

  exports.respondToReq = (req, res) => {
    res.render("requester");
}

exports.respondToLoc = (req, res) => {
    res.render("locate");
}
  
  