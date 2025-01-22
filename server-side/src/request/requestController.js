var express = require("express");
var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

var router = express.Router();
var Child = require("../child/child");
var User = require("../user/user");
var Parent = require("../parent/parent");
const Request = require("./request");

// Create
router.post("/", function (req, res) {
  const token = req.headers.authorization.split(" ")[1];

  // Get sender _id
  const childId = jwt.decode(token)._id;
  const childTz = jwt.decode(token).id;

  let parentId;

  Child.findById(childId, (err, child) => {
    if (err || !child) {
      res.status(500).send("error");
    }

    Parent.findById(child.parent, (err, parent) => {
      if (err || !parent) {
        res.status(500).send("error");
      }

      User.findById(parent.userDetails, (err, user) => {
        if (err || !user) {
          res.status(500).send("error");
        }
        parentId = user.idNumber;

        const request = new Request({
          childId: childTz,
          parentId: parentId,
          status: "0",
          dateRequested: Date.now(),
          amount: req.body.amount,
          reason: req.body.reason,
        });

        request.save().then((err, chore) => {
          if (err) {
            res.send(err);
          } else {
            res.status(200).send("request created successfully");
          }
        });
      });
    });
  });
});

// get the latest request
router.get("/", function (req, res) {
  const token = req.headers.authorization.split(" ")[1];

  // Get sender _id
  const parentId = jwt.decode(token)._id;
  const parentTz = jwt.decode(token).id;

  Request.findOne({ parentId: parentTz, status: "0" }, (err, request) => {
    if (err) {
      res.status(500).send("no requests");
    } else {
      console.log("request is- ", request);
      res.status(200).send(request);
    }
  });
});


// get all the requests of a parent
router.get("/allbyparentstatus/:status", function (req, res) { 
  const token = req.headers.authorization.split(" ")[1];

  // Get sender _id
  const parentId = jwt.decode(token)._id;
  const parentTz = jwt.decode(token).id;
  const status=req.params.status;
  if (status!='1' && status != '2')
  {
    Request.find({ parentId: parentTz}, (err, request) => {
      if (err) {
        res.status(500).send("no requests");
      } else {
        console.log("requests - ", request);
        res.status(200).send(request);
      }
    });
  }
else{
  Request.find({ parentId: parentTz, status: status}, (err, request) => {
    if (err) {
      res.status(500).send("no requests");
    } else {
      console.log("requests - ", request);
      res.status(200).send(request);
    }
  });
}
});

router.get("/allbyparent", function (req, res) {
   const token = req.headers.authorization.split(" ")[1];
 
   // Get sender _id
   const parentId = jwt.decode(token)._id;
   const parentTz = jwt.decode(token).id;
 
   Request.find({ parentId: parentTz}, (err, request) => {
     if (err) {
       res.status(500).send("no requests");
     } else {
       console.log("requests - ", request);
       res.status(200).send(request);
     }
   });
 });


// get all the requests of a child
router.get("/allbychild", function (req, res) {
  const token = req.headers.authorization.split(" ")[1];

  // Get sender _id
  const childId = jwt.decode(token)._id;
  const childTz = jwt.decode(token).id;

  Request.find({ childId: childTz}, (err, request) => {
    if (err) {
      res.status(500).send("no requests");
    } else {
      console.log("requests - ", request);
      res.status(200).send(request);
    }
  });
});


router.get("/allbychildstatus/:status", function (req, res) {
  const token = req.headers.authorization.split(" ")[1];

  // Get sender _id
  const childId = jwt.decode(token)._id;
  const childTz = jwt.decode(token).id;
  const status=req.params.status;
  if (status!='1' && status != '2')
  {
  Request.find({ childId: childTz}, (err, request) => {
    if (err) {
      res.status(500).send("no requests");
    } else {
      console.log("requests - ", request);
      res.status(200).send(request);
    }
  });
}
else {
  Request.find({ childId: childTz, status: status}, (err, request) => {
    if (err) {
      res.status(500).send("no requests");
    } else {
      console.log("requests - ", request);
      res.status(200).send(request);
    }
  });

}
});



router.put("/approve/:id", (req, res) => {
  Request.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
    // Check for erros
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/reject/:id", (req, res) => {
  Request.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
    // Check for erros
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

export default router;
