const mongoose = require("mongoose"),
  Subscriber = require("./models/volunteer");

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://kiezhelp1:kiezhelp1@ds261479.mlab.com:61479/heroku_w4qr4v2r",
  {
    useNewUrlParser: true,
  }
);

mongoose.Promise = global.Promise;
mongoose.connection;

var subscriber = [
  {
    type: "Volunteer",
    name: "Peter Parker",
    address: "Mehringdamm 60",
    date: "11/20/2014 22:00",
    option: "GroceryShopping",
    durafrom: "12:00",
    durato: "13:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Request",
    name: "Donald Pump",
    address: "Mehringdamm 66",
    date: "11/20/2014 22:00",
    option: "Babysitting",
    durafrom: "13:00",
    durato: "14:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Volunteer",
    name: "Gudrun von Berlin",
    address: "Hausburgstraße 24",
    date: "11/20/2014 22:00",
    option: "DogWalking",
    durafrom: "12:00",
    durato: "13:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Request",
    name: "Beate Schmidt",
    address: "Meinekestraße 37",
    date: "11/20/2014 22:00",
    option: "Babysitting",
    durafrom: "13:00",
    durato: "14:00",
    message: "Hey there i am looking for some help",
  },
  {
    type: "Volunteer",
    name: "Svea Peterson",
    address: "Mehringdamm 40",
    date: "11/20/2014 22:00",
    option: "RunErrands",
    durafrom: "12:00",
    durato: "13:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Request",
    name: "Seed Data",
    address: "Mehringdamm 66",
    date: "11/20/2014 22:00",
    option: "FriendlyChat",
    durafrom: "13:00",
    durato: "14:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Volunteer",
    name: "Engelika Markel",
    address: "Finowstraße 2",
    date: "11/20/2014 22:00",
    option: "FriendlyChat",
    durafrom: "12:00",
    durato: "13:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Request",
    name: "Seed Data",
    address: "Meinekestraße 37",
    date: "11/20/2014 22:00",
    option: "Babysitting",
    durafrom: "13:00",
    durato: "14:00",
    message: "Hey there i am looking for some help",
  },
  {
    type: "Volunteer",
    name: "Angelo Merte",
    address: "Schönleinstraße 12",
    date: "11/20/2014 22:00",
    option: "FriendlyChat",
    durafrom: "12:00",
    durato: "13:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Request",
    name: "Johanna von Ottensen",
    address: "Kottbusser Damm 13",
    date: "11/20/2014 22:00",
    option: "Babysitting",
    durafrom: "13:00",
    durato: "14:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Volunteer",
    name: "Mirijam Mader",
    address: "Petersburgerstraße 2",
    date: "11/20/2014 22:00",
    option: "GroceryShopping",
    durafrom: "12:00",
    durato: "13:00",
    message: "Hey there i m looking for some help",
  },
  {
    type: "Request",
    name: "Florentin Will",
    address: "Hauptstraße 3",
    date: "11/20/2014 22:00",
    option: "DogWalking",
    durafrom: "13:00",
    durato: "14:00",
    message: "Hey there i am looking for some help",
  },
];
Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  });
var commands = [];

subscriber.forEach((c) => {
  commands.push(
    Subscriber.create({
      type: c.type,
      name: c.name,
      zipcode: c.zipcode,
      address: c.address,
      date: c.date,
      option: c.option,
      durafrom: c.durafrom,
      durato: c.durato,
      message: c.message,
    })
  );
});
Promise.all(commands)
  .then((r) => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log(`ERROR: ${error}`);
  });
