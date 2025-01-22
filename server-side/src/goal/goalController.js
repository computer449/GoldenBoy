var mongoose = require("mongoose");
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var Goal = require("./goal")
var Child = require("../child/child")
var MoneyHistory = require("../moneyHistory/moneyHistory")

import regression from 'regression'

// Get active goal

router.get("/", function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    var childId = mongoose.Types.ObjectId(jwt.decode(token)._id);
    Child.findById(childId, (err, child) => {
        if (err) {
            return res.status(500).send("Error getting child");
        } else {
            var unachievedGoals = child.goals.filter(goal => !goal.isAchieved);
            Goal.findById(unachievedGoals[0], (err, goal) => {
                if (err) {
                    res.status(500).send("Error getting goal");
                } else {
                    return res.status(200).send(goal);
                }
            });
        }
    });
  });

  // get by goal id

  router.get("/byChild", function (req, res) {
    var childId = mongoose.Types.ObjectId(req.query.childId);
    Child.findById(childId, (err, child) => {
        if (err || !child) {
            return res.status(500).send("Error getting child");
        } else {
            var unachievedGoals = child.goals.filter(goal => !goal.isAchieved);
            Goal.findById(unachievedGoals[0], (err, goal) => {
                if (err) {
                    res.status(500).send("Error getting goal");
                } else {
                    return res.status(200).send(goal);
                }
            });
        }
    });
  });

// Create a new goal.

router.post("/", (req, res) => {
    const goal = new Goal({
        description: req.body.description,
        amount: req.body.amount,
        isAchieved: req.body.isAchieved
    })

    const token = req.headers.authorization.split(" ")[1];
    var childId = mongoose.Types.ObjectId(jwt.decode(token)._id);

    // Create the new goal & Add it to the child's goals array.
    goal.save().then(goal => {
        Child.findByIdAndUpdate(childId,
            { $push: { goals: goal._id } },
            { new: true, useFindAndModify: false }, 
            (err, child) => {
                if (err) { res.send(err) }
                else { res.send(goal) }
            }
        );
    });
})

// Update existing goal by id.
router.put("/:id", (req, res) => {
    Goal.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
        // Check for erros
        if (err) { res.send(err) }
        else { res.send(result) }
    });
});

// Remove existing goal by id.
router.delete("/:id", (req, res) => {
    Goal.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) { res.send(err) }
        else { res.send(result) }
    })
})

router.post("/predict", (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    var childId = mongoose.Types.ObjectId(jwt.decode(token)._id);
    Child.findById(childId, (err, child) => {
        if (err) {
            return res.status(500).send("Error getting child");
        } else {
            var unachievedGoals = child.goals.filter(goal => !goal.isAchieved);
            Goal.findById(unachievedGoals[0], (err, goal) => {
                if (err) {
                    res.status(500).send("Error getting goal");
                } else {
                    MoneyHistory.find({ child: childId}).sort({date: "ascending"}).exec((err, historyList) => {
                        if (err) {
                            res.status(500).send("Error getting child's money history")
                        } else if (historyList.length == 0) {
                            res.status(500).send("Child has no money history")
                        } else {
                            // Data preparation
                            var summedByDay = sumAmountByDay(historyList);
                            var preparedData = createSortedDaysArray(summedByDay);
                            
                            // Data prediction
                            var regressionEquation = regression.linear(preparedData);
                            var predictedDay = regressionEquation.predict(goal.amount)

                            // Calculate how many days left until the goal is reached
                            var todayDateDiff = Math.floor((new Date() - historyList[0].date) / (1000*60*60*24))
                            var daysLeft = Math.round(predictedDay[1] - todayDateDiff)

                            res.status(200).send({'daysLeft': daysLeft});
                        }
                    })
                }
            });
        }
    });
})

//
// This function represents the data in every single day, even if there were no changes.
//
function createSortedDaysArray(moneyHistory) {
    var finalList = []
    moneyHistory.push({'date': new Date(), 'amount': moneyHistory[moneyHistory.length - 1].amount})

    for (var i = 0; i < moneyHistory.length - 1; i++) {
        var currDate = new Date(moneyHistory[i].date)
        var nextDate = new Date(moneyHistory[i + 1].date)

        while (currDate < nextDate) {
            finalList.push([moneyHistory[i].amount, finalList.length])
            currDate.setDate(currDate.getDate() + 1)
        }
    }

    return finalList
}

//
// This function represents only the dates with changes and the amount of money in those days.
//
// function createSortedDaysArray(moneyHistory) {
//     var finalList = []
//     // moneyHistory.push({'date': new Date(), 'amount': moneyHistory[moneyHistory.length - 1].amount})
//     finalList.push([moneyHistory[0].amount, 0])

//     for (var i = 0; i < moneyHistory.length - 1; i++) {
//         var dateDiff = Math.floor((moneyHistory[i + 1].date - moneyHistory[i].date) / (1000*60*60*24))
//         finalList.push([moneyHistory[i+1].amount, finalList[finalList.length - 1][1] + dateDiff])
//         // var currDate = new Date(moneyHistory[i].date)
//         // var nextDate = new Date(moneyHistory[i + 1].date)

//         // while (currDate < nextDate) {
//         //     finalList.push([moneyHistory[i].amount, finalList.length])
//         //     currDate.setDate(currDate.getDate() + 1)
//         // }
//     }

//     return finalList
// }

function sumAmountByDay(moneyHistory) {
    var summedList = []

    var currAmount = 0
    var isLast = false
    for (var i = 0; i < moneyHistory.length - 1; i++) {
        var currDate = new Date(moneyHistory[i].date.toDateString())
        var nextDate = new Date(moneyHistory[i + 1].date.toDateString())
        
        currAmount += moneyHistory[i].amount
        isLast = (i + 1 == moneyHistory.length - 1)

        if (currDate.valueOf() != nextDate.valueOf())  {
            summedList.push({'date': currDate, 'amount': currAmount})
            currAmount = 0

            if (isLast) {
                summedList.push({'date': nextDate, 'amount': moneyHistory[i + 1].amount})
            }
        } else if (isLast) {
            currAmount += moneyHistory[i + 1].amount
            summedList.push({'date': currDate, 'amount': currAmount})
        }
    }

    return summedList
}

export default router;
