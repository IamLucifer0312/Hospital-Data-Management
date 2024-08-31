const express = require("express");
const router = express.Router();
const {
  getStaffScheduleController,
  getStaffSchedulesByStaffController,
  addStaffScheduleController,
  updateStaffScheduleController,
  deleteStaffScheduleController,
} = require("../controllers/staffScheduleController");

// STAFF SCHEDULE Routes

// GET will send undefined (for specific id search) or empty array (for collection search) if there is no result from mysql, otherwise it will send the result in object or array of objects
// POST will send error object including error msg if failed to insert data, otherwise it will send the newly inserted object
// PUT same with POST but for update
// DELETE will send error object including error msg if failed to delete data, otherwise it will send nothing (No Content) when successfully deleted

router.get("/:staffID/schedules/:scheduleID", getStaffScheduleController);
router.get("/:staffID/schedules", getStaffSchedulesByStaffController);
router.post("/:staffID/schedules/", addStaffScheduleController);
router.put("/:staffID/schedules/:scheduleID", updateStaffScheduleController);
router.delete("/:staffID/schedules/:scheduleID", deleteStaffScheduleController);

module.exports = router;
