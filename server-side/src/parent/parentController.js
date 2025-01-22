var express = require("express");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var router = express.Router();
var Parent = require("./parent");
const User = require("../user/user");

// Get basic info on a child - name and money
router.post("/", function (req, res) {
  // Get sender token
  const token = req.headers.authorization.split(" ")[1];

  // Get sender _id
  const sender = jwt.decode(token)._id;

    Parent.findById(sender, (err, parent) => {
      if (err || !parent) {
        res.status(500).send("no authorization");
      } else {
          res.status(200).send(parent);
      }
    });
});

export default router;
