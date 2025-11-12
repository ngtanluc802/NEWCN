const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  origin: String,
  destination: String,
  date: Date,
  price: Number,
  seats: [
    {
      number: String,
      isBooked: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Trip", tripSchema);
