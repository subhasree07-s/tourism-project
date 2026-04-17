const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Destination', destinationSchema);