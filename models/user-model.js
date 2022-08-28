const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: String,
  cafe_id: String,
  isOccupied: Boolean,
  order: {},
});

module.exports = model("User", UserSchema);
