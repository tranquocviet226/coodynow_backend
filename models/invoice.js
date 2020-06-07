const mongoose = require("mongoose");

const Invoice = new mongoose.Schema({
  userId: String,
  total: Number,
  items: Object,
  date: String,
});

module.exports = mongoose.model("invoices", Invoice);
