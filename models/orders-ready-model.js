const { Schema, model } = require("mongoose");


const ordersReadyModel = new Schema({
    product: [{ type: Schema.Types.ObjectId, ref: "Menu" }],
    tableNum: String,
    cafeId:String,
    tableId: String,
})

module.exports = model("ordersReady", ordersReadyModel);
