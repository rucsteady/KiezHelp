const mongoose = require("mongoose"),
  Requester = require("./models/requester");

mongoose.connect(process.env.MONGODB_URI || "mongodb://kiezhelp1:kiezhelp1@ds261479.mlab.com:61479/heroku_w4qr4v2r", {
    useNewUrlParser: true,
});

mongoose.Promise = global.Promise;
mongoose.connection;

var requester = [
  {
    type: "Volunteer",
    name: "Norbert Klausen",
    zipcode: 10999,
    address: "Mehringdamm 66",
    date: ("11/20/2014 04:11"),
    option: "1",
    durafrom: "12:00",
    durato: "13:00",
    message: "Hey there i m looking for some help",
  },
 
];
Requester.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  });
var commands = [];

requester.forEach((c) => {
  commands.push(
    Requester.create({
      name: c.name,
      zipcode: c.zipcode,
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
