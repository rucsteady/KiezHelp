"use strict";

const Volunteer = require("../models/volunteer");
const rp = require('request-promise');
const $ = require('cheerio');

exports.getVolSubscriptionPage = (req, res) => {
    res.render("volunteer");
};

exports.saveAllSubscriber = (req, res) => {
    let newVolSubscriber = new Volunteer({
        type: req.body.type,
        name: req.body.name,
        address: req.body.address,
        option: req.body.option,
        date: req.body.date,
        durafrom: req.body.durafrom,
        durato: req.body.durato,
        message: req.body.message,
    });
    newVolSubscriber
        .save()
        .then(() => {
            res.render("thanks");
        })
        .catch((error) => {
            if (error) res.send(error);
        });
};

exports.getAllReqSubscribers = (req, res) => {
    Volunteer.find({ type: "Request" })
        .exec()
        .then((volunteers) => {
            res.render("volunteers", {
                volunteers: volunteers,
                type: "Request"
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
    Volunteer.deleteMany({ type: paramsType })
        .exec()
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
    Volunteer.find({})
        .exec()
        .then((volunteers) => {
            res.render("admin", {
                volunteers: volunteers
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
    Volunteer.deleteOne({ _id: paramsId })
        .exec()
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("del One promise complete");
        });
    Volunteer.find({})
        .exec()
        .then((volunteers) => {
            res.render("admin", {
                volunteers: volunteers
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
exports.getReqSubscriptionPage = (req, res) => {
    res.render("requester");
};

exports.getAllSubscribers = (req, res) => {
    let paramsType = req.params.type;
    let paramsCat = req.params.category;

    Volunteer.find({})
        .exec()
        .then((volunteers) => {
            res.render("locate", { type: paramsType, category: paramsCat, volunteers: volunteers });
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
    Volunteer.find({ type: "Volunteer" })
        .exec()
        .then((volunteers) => {
            res.render("volunteers", {
                volunteers: volunteers,
                type: "Volunteer"
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
    Volunteer.find({})
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
    var wikiUrls = [];
    const url = 'https://www.coolgenerator.com/de-address-generator';

    var types = ['Volunteer', 'Request'];
    var options = ['GroceryShopping', 'DogWalking', 'Babysitting', 'RunErrands', 'FriendlyChat', 'Other'];
    rp(url)
        .then(function(html) {

            for (let i = 0; i < 6; i++) {

                var newAdd = $('li > .font-18 > b > span', html)[i].children[0].data;

                var randType = (Math.random() * types.length);
                var randOption = (Math.random() * options.length);
                let newVolSubscriber = new Volunteer({
                    type: types[Math.floor(randType)],
                    // name: wikiUrls[0],
                    address: newAdd,
                    option: options[Math.floor(randOption)]
                });
                newVolSubscriber
                    .save()
                    .catch((error) => {
                        console.log(error.message);
                        return [];
                    })
                    .then(() => {
                        console.log("save promise complete");
                    });
                Volunteer.find({})
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