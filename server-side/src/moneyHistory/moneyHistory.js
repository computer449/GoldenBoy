var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var MoneyHistorySchema = new mongoose.Schema({
    child: {type: Schema.Types.ObjectId, ref: 'Child', required: true},
    amount: {type: Number, required: true},
    date: {type: Date, required: true}
});

module.exports = mongoose.model('MoneyHistory', MoneyHistorySchema);
