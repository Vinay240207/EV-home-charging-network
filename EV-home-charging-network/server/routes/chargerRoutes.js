const express = require("express");
const {
  addCharger,
  getChargers,
  getMyChargers,
  getAllChargers,
  updateChargerStatus,
  getChargerById,
} = require("../controllers/chargerController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getChargers);
router.get("/my", protect, authorize("owner"), getMyChargers);
router.get("/all", protect, authorize("admin"), getAllChargers);
router.get("/:id", getChargerById);
router.post("/", protect, authorize("owner"), addCharger);
router.put("/:id/status", protect, authorize("admin"), updateChargerStatus);

module.exports = router;
