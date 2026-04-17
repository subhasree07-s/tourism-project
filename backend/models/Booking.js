const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },

  hotel: {
    name: String,
    pricePerDay: Number,
    description: String,
    image: String
  },

  numberOfPeople: {
    type: Number,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    default: "UPI"
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed'
  }
},
{ timestamps: true });


module.exports = mongoose.model('Booking', bookingSchema);