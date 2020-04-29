const express = require("express"),
  app = express();

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const layouts = require("express-ejs-layouts");

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.get("view engine");
app.use(layouts);
app.use(express.static("public"));

app.get("/", homeController.sendIndexRes);
app.get("/volunteer", homeController.respondToVol);
app.get("/requester", homeController.respondToReq);
app.get ("/locate", homeController.respondToLoc);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
  });
  