const { Schema, model } = require("mongoose");
const tablesModel = require("./tables-model");

const Cafe = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  // bannerImg: { type: String, required: true },
  location: String,
  phoneNumber: Number,
  tables: [{ type: Schema.Types.ObjectId, ref: "tables" }],
  menu: [{ type: Schema.Types.ObjectId, ref: 'Menu' }],
});

module.exports = model("Cafe", Cafe);
