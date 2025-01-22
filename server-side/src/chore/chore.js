var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ChoreSchema = new Schema({
    description: {type: String, required: true},
    amount: {type: Number, min: 0, required: true},
    isFinished: {type: Boolean, required: true}
});

module.exports = mongoose.model('Chore', ChoreSchema);
