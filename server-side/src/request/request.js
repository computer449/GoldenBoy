var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var RequestSchema = new Schema({
    childId: {type: Number, required: true},
    parentId: {type: Number, required: true},
    status: {type: Number, required: true},
    dateRequested: {type: Date, required: true},
    amount: {type: Number, required: true},
    reason: {type: String, required: true}
});

module.exports = mongoose.model('Request', RequestSchema);
