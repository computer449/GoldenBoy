var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var UserSchema = new Schema({
  idNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  lastLogin: {type: Date, required: true}
});

module.exports = mongoose.model("User", UserSchema);
