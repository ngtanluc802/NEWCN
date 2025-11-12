const Booking = require("../models/Booking");
const Trip = require("../models/Trip");

exports.createBooking = async (req, res) => {
  try {
    const { tripId, name, phone, seatNumber } = req.body;

    // Update ghế trong trip
    await Trip.updateOne(
      { _id: tripId, "seats.number": seatNumber },
      { $set: { "seats.$.isBooked": true } }
    );

    const booking = await Booking.create({ tripId, name, phone, seatNumber });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
