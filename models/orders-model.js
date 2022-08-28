const { Schema, model } = require("mongoose");

const ordersModel = new Schema({
    product: [{ type: Schema.Types.ObjectId, ref: "Menu" }],
    tableNum: String,
    tableId: String,
    ordersReady: [],
    checked: { type: Boolean, default: false }
})

module.exports = model("orders", ordersModel);
