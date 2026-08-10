const Charger = require("../models/Charger");

// @desc    Add new charger
// @route   POST /api/chargers
// @access  Private (Owner)
const addCharger = async (req, res) => {
  try {
    const { name, location, latitude, longitude, price, type, power, ownerPhone } =
      req.body;

    if (
      !name ||
      !location ||
      latitude === undefined ||
      longitude === undefined ||
      !price ||
      !ownerPhone
    ) {
      return res.status(400).json({
        message:
          "Name, location, latitude, longitude, price and owner phone are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ message: "Invalid latitude or longitude" });
    }

    const charger = await Charger.create({
      name,
      location,
      latitude: lat,
      longitude: lng,
      price: Number(price),
      type: type || "AC Charger",
      power: power || "7.4 kW",
      owner: req.user._id,
      ownerPhone,
      status: "Pending Approval",
    });

    res.status(201).json({
      message: "Charger submitted successfully. Waiting for admin approval.",
      charger,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add charger",
      error: error.message,
    });
  }
};

// @desc    Get all approved chargers (for drivers)
// @route   GET /api/chargers
// @access  Public / Private
const getChargers = async (req, res) => {
  try {
    const chargers = await Charger.find({ status: "Approved" })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json(chargers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch chargers",
      error: error.message,
    });
  }
};

// @desc    Get owner's chargers
// @route   GET /api/chargers/my
// @access  Private (Owner)
const getMyChargers = async (req, res) => {
  try {
    const chargers = await Charger.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(chargers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your chargers",
      error: error.message,
    });
  }
};

// @desc    Get all chargers (admin)
// @route   GET /api/chargers/all
// @access  Private (Admin)
const getAllChargers = async (req, res) => {
  try {
    const chargers = await Charger.find()
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });
    res.json(chargers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch chargers",
      error: error.message,
    });
  }
};

// @desc    Approve / Reject charger
// @route   PUT /api/chargers/:id/status
// @access  Private (Admin)
const updateChargerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const charger = await Charger.findById(req.params.id);

    if (!charger) {
      return res.status(404).json({ message: "Charger not found" });
    }

    charger.status = status;
    await charger.save();

    res.json({
      message: `Charger ${status.toLowerCase()} successfully`,
      charger,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// @desc    Get single charger
// @route   GET /api/chargers/:id
// @access  Public
const getChargerById = async (req, res) => {
  try {
    const charger = await Charger.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );

    if (!charger) {
      return res.status(404).json({ message: "Charger not found" });
    }

    res.json(charger);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch charger",
      error: error.message,
    });
  }
};

module.exports = {
  addCharger,
  getChargers,
  getMyChargers,
  getAllChargers,
  updateChargerStatus,
  getChargerById,
};
