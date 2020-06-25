"use strict";

const Subscriber = require("../models/subscriber"),
    User = require("../models/user"),
    rp = require("request-promise"),
    $ = require("cheerio");



exports.acceptRequest = (req, res, next) => {
    console.log("running accept request");
    if (res.locals.currentUser) {
        console.log("has currentuser");
        let requestId = req.params.requestId;
        Subscriber.updateOne({ _id: requestId }, {
                "$set": {
                    "acceptanceStatus": "accepted",
                    "acceptedByUserId": res.locals.currentUser.userId
                }
            })
            .exec()
            .then(() => {
                //update accepting user's acceptedSub
                User.findOne({ _id: res.locals.currentUser.userId })
                    .then((user) => {
                        user.acceptedSubscribers.push(requestId);
                        //TODO need to update the subscribers id whenever there's a deletion in admin so user don't have subs that are already deleted
                        user.save();
                        Subscriber.populate(user, "acceptedSubscribers").then((populatedUser) => {
                            // console.log("sub:"+populatedUser);
                            console.log("subs");
                            res.locals.subs = populatedUser.subscribers;
                            res.locals.redirect = "/acceptedSubs";
                            res.locals.success = true;
                            next();
                        });
                    }).catch((error) => {
                        if (error) res.send(error);
                    });

            })
            .catch(error => {
                // next(error);
                console.log("cant find the sub that the user accepted: " + error.message);
                return [];
            });
    } else {
        console.log("no currentuser");
    }
};

exports.saveAllSubscriber = (req, res, next) => {
    let newVolReqEntry = {
        type: req.body.type,
        name: req.body.name,
        address: req.body.address,
        option: req.body.option,
        date: req.body.date,
        durafrom: req.body.durafrom,
        durato: req.body.durato,
        message: req.body.message,
    };
    let userId = '';
    if (res.locals.currentUser) {
        newVolReqEntry.userId = res.locals.currentUser._id;
        userId = res.locals.currentUser._id;
    } else {
        newVolReqEntry.userId = '';
    }
    var subId;
    Subscriber.create(newVolReqEntry)
        .then((entry) => {
            subId = entry._id;
            User.findOne({ _id: userId })
                .then((user) => {
                    user.subscribers.push(subId);
                    //TODO need to update the subscribers id whenever there's a deletion in admin so user don't have subs that are already deleted
                    user.save();
                    Subscriber.populate(user, "subscribers").then((populatedUser) => {
                        // console.log("sub:"+populatedUser);
                        console.log("subs");
                        res.locals.subs = populatedUser.subscribers;
                    });
                }).catch((error) => {
                    if (error) res.send(error);
                });
            res.locals.redirect = '/profile';
            // res.locals.userId = req.body.userId;
            next();
            // res.render("success", { action: "SUBMIT" });
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
exports.redirectView = (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath && res.locals && res.locals.subs) { //&& res.locals.user) {
        res.redirect(url.format({
            pathname: redirectPath,
            query: {
                "subs": res.locals.subs,
                // "user": res.locals.user
            }
        }));
    } else if (redirectPath) {
        res.redirect(url.format({
            pathname: redirectPath
        }));

    } else next();
}