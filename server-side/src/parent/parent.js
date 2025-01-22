var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ParentSchema = new Schema({
  userDetails: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  children: [{ type: Schema.Types.ObjectId, ref: "Child" }],
  chores: [{ type: Schema.Types.ObjectId, ref: "Chore" }],
});

module.exports = mongoose.model("Parent", ParentSchema);
