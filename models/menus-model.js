const { Schema, model } = require("mongoose");

const menuModel = new Schema({
    name: String,
    price: String,
    img: String,
    type: String,
})

module.exports = model("Menu", menuModel);
