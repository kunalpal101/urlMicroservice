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
  actualUrl: { type: String, unique: true },
  newUrl: { type: Number },
});

console.log("Program Initiated...");

let Url;
Url = mongoose.model("Url", UrlSchema);


let flag = 0;
app.post("/url-fetch", function (req, res) {
  var String = req.body;
  //console.log("Received body: " + String.actualUrl);

  Url.count({}, async function (err, data) {
    let flag = await data;
    if (err) return console.log(err);

    Url.find({ actualUrl: String.actualUrl }, function (err, data) {
      if (err) console.log(err);
      if (data != "") {
        //Need to put data[0] as the data received from .find will be an array
        res.json({
          status: "duplication error",
          actualUrl: data[0].actualUrl,
          newUrl: data[0].newUrl,
        });
        return console.log("URL already present with value: " + data[0].newUrl);
      } else {
        flag++;
        let new_url = new Url({
          actualUrl: String.actualUrl,
          newUrl: flag,
        });
        new_url.save(function (err, data) {
          if (err) return console.log(err);
        });
        res.json({
          status: "success",
          actualUrl: String.actualUrl,
          newUrl: flag,
        });
      }
    });
  });
});

app.post("/url-direct", function (req, res) {
  //console.log(req.body);

  var findURL = function (done) {
    var Body = req.body;
    //console.log("value of Body.newURL=" + Body.newUrl);

    Url.find({ newUrl: Body.newUrl }, function (err, data) {
      if (err) return console.log("The error is " + err);

      if (data == "") {
        return res.status(404).send({ data: "Not Found" });
      } else {
        res.send(data);
      }
    });
  };

  findURL();
});

//Serving the index file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/FrontEnd/index.html");
  //Using the "public folder"
  app.use(express.static(__dirname + "/FrontEnd"));
});


// listen for requests :)
var server = app.listen(8080, function () {
  console.log("Ready on port %d", server.address().port);
});
