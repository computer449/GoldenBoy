var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var GoalSchema = new Schema({
    description: {type: String, required: true},
    amount: {type: Number, required: true},
    isAchieved: {type: Boolean, required: true}
});

module.exports = mongoose.model('Goal', GoalSchema);
