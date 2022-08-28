const { Schema, model } = require("mongoose");

const tablesModel = new Schema({
    number: { type: Number },
    isOccupied: { type: Boolean, default: false },
    orders: { type: Schema.Types.ObjectId, ref: 'orders', default: null },
})

module.exports = model("tables", tablesModel);
