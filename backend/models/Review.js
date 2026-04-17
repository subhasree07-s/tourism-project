const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },

  // ✅ ADD THIS
  name: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);