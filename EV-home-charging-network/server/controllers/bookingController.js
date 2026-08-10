const Booking = require("../models/Booking");
const Charger = require("../models/Charger");

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (Driver)
const createBooking = async (req, res) => {
  try {
    const { chargerId, date, slot } = req.body;

    if (!chargerId || !date || !slot) {
      return res.status(400).json({ message: "Charger, date and slot are required" });
    }

    const charger = await Charger.findById(chargerId);
    if (!charger || charger.status !== "Approved") {
      return res.status(404).json({ message: "Charger not available" });
    }

    // Check if slot already booked
    const existing = await Booking.findOne({
      charger: chargerId,
      date,
      slot,
      status: "Confirmed",
    });

    if (existing) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    const booking = await Booking.create({
      charger: chargerId,
      driver: req.user._id,
      date,
      slot,
      status: "Confirmed",
      amount: charger.price * 10, // approximate for 10 kWh session
      paymentStatus: "Pending",
    });

    const populated = await Booking.findById(booking._id)
      .populate("charger")
      .populate("driver", "name email phone");

    res.status(201).json({
      message: "Booking confirmed successfully!",
      booking: populated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  }
};

// @desc    Get driver's bookings
// @route   GET /api/bookings/my
// @access  Private (Driver)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user._id })
      .populate("charger")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// @desc    Get bookings for owner's chargers
// @route   GET /api/bookings/owner
// @access  Private (Owner)
const getOwnerBookings = async (req, res) => {
  try {
    const myChargers = await Charger.find({ owner: req.user._id }).select("_id");
    const chargerIds = myChargers.map((c) => c._id);

    const bookings = await Booking.find({ charger: { $in: chargerIds } })
      .populate("charger")
      .populate("driver", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Driver)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

// @desc    Mark payment as paid
// @route   PUT /api/bookings/:id/pay
// @access  Private (Driver)
const markPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("charger");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.paymentStatus = "Paid";
    await booking.save();

    res.json({
      message: "Payment recorded successfully",
      booking,
      ownerPhone: booking.charger?.ownerPhone,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update payment",
      error: error.message,
    });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/all
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("charger")
      .populate("driver", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  cancelBooking,
  markPaid,
  getAllBookings,
};
