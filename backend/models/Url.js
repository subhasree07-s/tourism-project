const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortId: String
});

module.exports = mongoose.model("Url", urlSchema);