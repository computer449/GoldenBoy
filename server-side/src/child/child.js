var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ChildSchema = new Schema({
  userDetails: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Parent", required: true },
  money: { type: Number, default: 0 },
  allowance: { type: Schema.Types.Mixed, default: { amount: "", beginDate: "", endDate: "", frequency: "" } },
  goals: [{ type: Schema.Types.ObjectId, ref: "Goal" }],
  requests: [{ type: Schema.Types.ObjectId, ref: "Request" }],
  gameScore: [{ type: Number, default: 0 }],
});

module.exports = mongoose.model("Child", ChildSchema);
