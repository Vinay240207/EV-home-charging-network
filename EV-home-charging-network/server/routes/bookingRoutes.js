const express = require("express");
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  cancelBooking,
  markPaid,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, authorize("driver"), createBooking);
router.get("/my", protect, authorize("driver"), getMyBookings);
router.get("/owner", protect, authorize("owner"), getOwnerBookings);
router.get("/all", protect, authorize("admin"), getAllBookings);
router.put("/:id/cancel", protect, authorize("driver"), cancelBooking);
router.put("/:id/pay", protect, authorize("driver"), markPaid);

module.exports = router;
