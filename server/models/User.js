const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  newsPreference: String,
  currency: String,
  name: String,
  exchange: String,
  photo: String,
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
