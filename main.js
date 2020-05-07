const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  volunteersController = require("./controllers/volunteersController"),
  Volunteer = require("./models/volunteer"),
  layouts = require("express-ejs-layouts");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/kiezhelp", {
  useNewUrlParser: true,
});
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));
app.get("/", homeController.getIndex);

app.get("/volunteers", volunteersController.getAllVolSubscribers,
  (req, res, next) => {
    console.log(req.data);
    res.render("volunteers", { volunteers: req.data });
  }
);

app.get("/volunteer", volunteersController.getVolunteer);
app.post("/subscribe", volunteersController.saveVolSubscriber);


app.get("/requester", homeController.getRequester);
app.get("/locate/:type/:category", homeController.sendReqParam);

app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
