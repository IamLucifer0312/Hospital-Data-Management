const express = require("express");
const router = express.Router();
const {
  getStaffScheduleController,
  getStaffSchedulesByStaffController,
  addStaffScheduleController,
  updateStaffScheduleController,
  deleteStaffScheduleController,
  getDoctorScheduleByGivenTimeController,
} = require("../controllers/staffScheduleController");

// STAFF SCHEDULE Routes

// GET will send undefined (for specific id search) or empty array (for collection search) if there is no result from mysql, otherwise it will send the result in object or array of objects
// POST will send error object including error msg if failed to insert data, otherwise it will send the newly inserted object
// PUT same with POST but for update
// DELETE will send error object including error msg if failed to delete data, otherwise it will send nothing (No Content) when successfully deleted

router.get("/:scheduleId", getStaffScheduleController);
router.get("/staff/:staffId", getStaffSchedulesByStaffController);
router.post("/staff/:staffId", addStaffScheduleController);
router.put("/:scheduleId/staff/:staffId", updateStaffScheduleController);
router.delete("/:scheduleId", deleteStaffScheduleController);
// POST route to get all doctor schedules within a given duration
router.post("/doctors", getDoctorScheduleByGivenTimeController);

module.exports = router;
