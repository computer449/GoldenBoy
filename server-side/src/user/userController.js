var express = require("express");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var router = express.Router();
var User = require("../user/user");
var Parent = require("../parent/parent");
var Child = require("../child/child");

const signUserToJwt = (personId, currUser, res) => {
  var userObj = {
    _id: personId._id,
    id: currUser.idNumber,
    name: currUser.name,
  };

  jwt.sign(userObj, "dollarz#jwt", (err, token) => {
    if (err) {
      console.log(err);
      res.status(401).send("server error");
    } else {
      res.json({
        token,
      });

      res.status(200).send();
    }
  });
};

router.post("/login", function (req, res, next) {
  const userId = req.body.userId;
  const password = req.body.password;

  User.findOne({ idNumber: userId, password: password })
    .then((currUser) => {
      // Check if parent
      Parent.findOne({ userDetails: currUser._id }, "_id", (err, parentId) => {
        if (parentId) {
          return signUserToJwt(parentId, currUser, res);
        } else {
          // check if child
          Child.findOne({ userDetails: currUser._id }, "_id").then((childId) => {
            if (childId) {
              return signUserToJwt(childId, currUser, res);
            }
          });
        }
      });
    })
    .catch((err) => {
      res.status(401).send("user does not exist");
    });
});

// Register new parent to the DB
router.post("/registerParent", function (req, res, next) {
  const user = new User({
    idNumber: req.body.id,
    name: req.body.name,
    password: req.body.password,
    lastLogin: new Date(),
  });

  user
    .save()
    .then(() => {
      const parent = new Parent({
        userDetails: user._id,
        children: [],
        chores: [],
      });
      parent.save().then(res.status(200).send());
    })
    .catch((err) => res.status(500).send("error"));
});

// Register new child to the DB
router.post("/registerChild", function (req, res, next) {
  try {
    // Get sender token
    const token = req.headers.authorization.split(" ")[1];

    // Get sender _id
    const senderId = jwt.decode(token)._id;

    // only parents can register childrens
    Parent.findById(senderId, (err, parent) => {
      if (err || parent === undefined) {
        return res.status(401).send("no auth");
      }
    }).catch((err) => {
      return res.status(401).send("no auth");
    });

    const user = new User({
      idNumber: req.body.id,
      name: req.body.name,
      password: req.body.password,
      lastLogin: new Date(),
    });

    // register new user
    user.save().then(() => {
      const child = new Child({
        userDetails: user._id,
        parent: senderId,
      });

      // register new child
      child.save().then(() => {
        // update parent - add to him the new child
        Parent.findByIdAndUpdate(
          senderId,
          { $push: { children: child._id } },
          { new: true, useFindAndModify: false },
          (err) => {
            if (err) {
              res.status(500).send("error creating new child");
            } else {
              res.status(200).send("child created successfully");
            }
          }
        );
      });
    });
  } catch (err) {
    res.status(500).send("error creating new child");
  }
});

router.get("/isParent", function (req, res, next) {
  // Get sender token
  const token = req.headers.authorization.split(" ")[1];

  // Get sender _id
  const senderId = jwt.decode(token)._id;

  Parent.findById(senderId, (err, parent) => {
    if (parent) {
      return res.status(200).send("true");
    }

    if (err) {
      return res.status(500).send("server error");
    }

    return res.status(200).send("false");
  });
});

router.get("/_id", (req, res) => {
  // Get sender token
  const token = req.headers.authorization.split(" ")[1];

  // Get sender _id
  const senderId = jwt.decode(token)._id;

  res.status(200).send(senderId);
});

router.get("/getUserByTz/:tz", (req, res) => {
  User.findOne({ idNumber: req.params.tz }, (err, user) => {
    if (err || !user) {
      res.status(500).send("error");
    } else {
      res.status(200).send(user);
    }
  });
});

export default router;
