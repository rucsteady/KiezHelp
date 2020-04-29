const port = process.env.PORT || 3000,
    express = require("express"),
    layouts = require("express-ejs-layouts"),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    app = express();

app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(layouts);
app.get("/", (req, res) => {
        res.render("index");
    })
    .listen(port, () => {
        console.log(`The Express.js server has started and is listening
        ➥ on port number: ${port}`);
    });
app.get("/:page", homeController.respondWithPage);
app.get("/locate/:type/:category", homeController.sendReqParam);
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful!");
});
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);