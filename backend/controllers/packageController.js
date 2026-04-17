const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: String,
  pricePerDay: Number,
  description: String,
  image: String
});

const packageSchema = new mongoose.Schema({
  name: String,
  description: String,
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination"
  },
  duration: String,
  price: Number,
  image: String,

  transportation: [String],
  sightseeing: [String],
  meals: [String],
  itinerary: [String],

  // ✅ NEW FIELD
  hotels: [hotelSchema]
});

module.exports = mongoose.model("Package", packageSchema);