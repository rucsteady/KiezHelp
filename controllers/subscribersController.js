"use strict";

const Subscriber = require("../models/subscriber");
const rp = require("request-promise");
const $ = require("cheerio");



exports.saveAllSubscriber = (req, res) => {
    let newVolReqEntry = new Subscriber({
        type: req.body.type,
        name: req.body.name,
        address: req.body.address,
        option: req.body.option,
        date: req.body.date,
        durafrom: req.body.durafrom,
        durato: req.body.durato,
        message: req.body.message,
    });
    newVolReqEntry
        .save()
        .then(() => {
            res.render("success", { action: "SUBMIT" });
        })
        .catch((error) => {
            if (error) res.send(error);
        });
};

exports.getAllReqSubscribers = (req, res) => {
    Subscriber.find({ type: "Request" })
        .exec()
        .then((volunteers) => {
            res.render("showEachCategory", {
                volunteers: volunteers,
                type: "Request",
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};
exports.deleteSubscribers = (req, res) => {
    let paramsType = req.params.type;
    Subscriber.deleteMany({ type: paramsType })
        .exec()
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
    Subscriber.find({})
        .exec()
        .then((volunteers) => {
            res.render("admin", {
                volunteers: volunteers,
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};

exports.deleteOneSubscriber = (req, res) => {
    let paramsId = req.params.id;
    Subscriber.deleteOne({ _id: paramsId })
        .exec()
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("del One promise complete");
        });
    Subscriber.find({})
        .exec()
        .then((volunteers) => {
            res.render("admin", {
                volunteers: volunteers,
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("admin promise complete");
        });
};

exports.getVolSubscriptionPage = (req, res) => {
    res.render("volunteer");
};

exports.getReqSubscriptionPage = (req, res) => {
    res.render("requester");
};

exports.getAllSubscribers = (req, res) => {
    let paramsType = req.params.type;
    let paramsCat = req.params.category;

    Subscriber.find({})
        .exec()
        .then((volunteers) => {
            res.render("locate", {
                type: paramsType,
                category: paramsCat,
                volunteers: volunteers,
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};

exports.getAllVolSubscribers = (req, res) => {
    Subscriber.find({ type: "Volunteer" })
        .exec()
        .then((volunteers) => {
            res.render("showEachCategory", {
                volunteers: volunteers,
                type: "Volunteer",
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};

exports.getAdmin = (req, res) => {
    Subscriber.find({})
        .exec()
        .then((volunteers) => {
            res.render("admin", {
                volunteers: volunteers,
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};

exports.saveFakeData = (req, res) => {
    // const da = scrapper.getRandomData;
    // var wikiUrls = [];
    const url = "https://www.coolgenerator.com/de-address-generator";

    var types = ["Volunteer", "Request"];
    var names = [
        "Peter Parker",
        "Donald Pump",
        "Gudrun von Berlin",
        "Beate Schmidt",
        "Clive Makerson",
        "Reggie Mueller",
        "Heidi Klump",
        "Svea Peterson",
        "Dr. Doolittle",
        "Maikel Neit",
        "The Queen",
        "Der Graf von Monte",
        "Jordan Peterson",
        "Katja Jes",
        "Simon Kretschmar",
        "Dieter Boo",
        "Dr. House",
        "Parker Lewis",
        "Hans Juergen Genscher",
        "Frank Walter Schroedinger",
        "Michael Gorbatschoff",
        "Angelo Merte",
        "Engelika Markel",
        "Mike Meier",
        "Mirijam Mader",
        "Hank Schrader",
        "Nett Flanders",
        "Julia Shaw",
        "Nils Nilsen",
        "Malek Lobo",
        "Karthin Kranz",
        "Florentin Will",
        "Johanna von Ottensen",
        "Das ist gar kein echter Name",
    ];
    var options = [
        "GroceryShopping",
        "DogWalking",
        "Babysitting",
        "RunErrands",
        "FriendlyChat",
        "Other",
    ];

    var fromTimes = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
    ];

    var toTimes = [
        "16:30",
        "17:30",
        "18:30",
        "19:30",
        "20:30",
        "21:30",
        "22:30",
        "23:30",
    ];
    rp(url)
        .then(function(html) {
            for (let i = 0; i < 6; i++) {
                var newAdd = $("li > .font-18 > b > span", html)[i].children[0].data;

                var randType = Math.random() * types.length;
                var randName = Math.random() * names.length;
                var randOption = Math.random() * options.length;
                var randomFromTime = Math.random() * fromTimes.length;
                var randomToTime = Math.random() * toTimes.length;
                let newVolReqEntry = new Subscriber({
                    type: types[Math.floor(randType)],
                    name: names[Math.floor(randName)],
                    address: newAdd,
                    option: options[Math.floor(randOption)],
                    durafrom: fromTimes[Math.floor(randomFromTime)],
                    durato: toTimes[Math.floor(randomToTime)],
                    message: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam",
                });
                newVolReqEntry
                    .save()
                    .catch((error) => {
                        console.log(error.message);
                        return [];
                    })
                    .then(() => {
                        console.log("save promise complete");
                    });
                Subscriber.find({})
                    .exec()
                    .then((volunteers) => {
                        res.render("admin", {
                            volunteers: volunteers,
                        });
                    })
                    .catch((error) => {
                        console.log(error.message);
                        return [];
                    })
                    .then(() => {
                        console.log("admin promise complete");
                    });
            }
        })
        .catch(function(err) {
            //handle error
            console.log("scrapping error:" + err);
        });
};