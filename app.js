//Old env
// MONGO_URI = "mongodb+srv://new-user-101:effigy123@cluster0.ow0ocjq.mongodb.net/?retryWrites=true&w=majority"

let express = require("express");
let app = express();

require("dotenv").config();
var mongoose = require("mongoose");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", function (req, res) {
  // Handle the data in the request
  var string = req.body;
  console.log(string);
  res.json(string);
});

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const Schema = mongoose.Schema;
const UrlSchema = new Schema({
  actualUrl: { type: String },
  newUrl: { type: Number },
});

console.log("Hello World");

let Url;
Url = mongoose.model("Url", UrlSchema);

let createAndSave = function (done) {
  let new_url = new Url({ actualUrl: "flag", newUrl: 0 });
  new_url.save(function (err, data) {
    if (err) return console.log("Error is " + err);
    // done(null);
  });
};

//createAndSave();

let flag = 0;
app.post("/url-fetch", function (req, res) {
  var String = req.body;
  console.log("Received body: " + String.actualUrl);

  Url.find({ actualUrl: String.actualUrl }, function (err, data) {
    if (err) return console.log(err);
    else {
      if (!data.length) {
        //data.length needed to check if data is already present or not
        console.log("Data not found");
        Url.find({ actualUrl: "flag" }, function (err, data) {
          if (err) return console.log(err);
          // console.log(data[0]);
          flag = Number(data[0].newUrl) + 1;

          let createAndSave = function (done) {
            let new_url = new Url({
              actualUrl: String.actualUrl,
              newUrl: flag,
            });
            console.log("DONE");
            new_url.save(function (err, data) {
              if (err) return console.log("Error is " + err);
              // done(null);
            });

            Url.findOneAndUpdate(
              { actualUrl: "flag" },
              { newUrl: flag },
              { new: true },
              (err, updatedDoc) => {
                // console.log("Flag updated");
                // console.log("Flag value = " +flag);
                if (err) return console.log(err);
                //console.log(updatedDoc);
                //done(null, updatedDoc);
              }
            );
          };

          createAndSave();
          res.json({ new_Url: flag });
        });
        return;
      }

      // if (data !== []) {

      // }
      var data_found = data[0];
      console.log(data);
      console.log(data[0]);
      console.log(data_found);
      //console.log("found full=" + x);
      console.log("found=" + data_found.newUrl);

      res.send({ new_Url: data_found.newUrl });
    }
  });
});

app.post("/url-direct", function (req, res) {
  console.log(req.body);

  var findURL = function (done) {
    var Body = req.body;
    console.log("value of Body.newURL=" + Body.newUrl);
    //res.send(req);

    Url.find({ newUrl: Body.newUrl }, function (err, data) {
      if (err) return console.log("The error is " + err);

      if (!data.length) {
        res.send({ actualUrl: 1.1 });
        console.log("Workd, ending");
        return;
      }

      console.log(data);
      res.send(data);
    });
    // Url.find({ newUrl: "23" }, function (err, data) {
    //   if (err) return console.log(err);
    //   console.log(data);
    //   res.send(data);
    // });
  };

  findURL();
  //res.send(req.body);
});

//Using the "public folder"
//app.use(express.static("public"));

//Serving the index file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/FrontEnd/index.html");
  app.use(express.static(__dirname + "/FrontEnd"));
});

console.log("Bye World");

// listen for requests :)
// var listener = app.listen(process.env.PORT, function () {
//   console.log("Your app is listening on port " + listener.address().port);
// });

var server = app.listen(8080, function () {
  console.log("Ready on port %d", server.address().port);
});
