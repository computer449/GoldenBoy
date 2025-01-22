"use strict";

var express = require("express");
var mongoose = require("mongoose");
var Parent = require("./src/parent/parent");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
var mongoDB = "mongodb+srv://dollarz:dollarz123@omerm-cluster.pzgxz.mongodb.net/dollarz?retryWrites=true&w=majority";

var routes = require("./routes/router").default;
var goals = require("./src/goal/goalController").default;
var chores = require("./src/chore/choreController").default;
var user = require("./src/user/userController").default;
var request = require("./src/request/requestController").default;
var child = require("./src/child/childController").default;
var parent = require("./src/parent/parentController").default;
var game = require("./src/game/gameController").default;
var moneyHistory = require("./src/moneyHistory/moneyHistoryController").default;

app.use(cors());

// Set all routes from routes folder
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use("/", routes);
app.use("/goals", goals);
app.use("/child", child);
app.use("/request", request);
app.use("/chore", chores);
app.use("/user", user);
app.use("/parent", parent);
app.use("/game", game);
app.use("/moneyHistory", moneyHistory);

// Launch the server on port 3000
var server = app.listen(3000, function () {
  var _server$address = server.address(),
      address = _server$address.address,
      port = _server$address.port;

  console.log("Listening at http://" + address + ":" + port);

  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
  mongoose.set("useCreateIndex", true);
});

module.exports = app;
//# sourceMappingURL=app.js.map