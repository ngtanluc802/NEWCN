const Trip = require("../models/Trip");

const getTrips = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    const trips = await Trip.find({
      origin,
      destination,
      date: { $gte: new Date(date) },
    });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTrips, createTrip };
