const express = require("express");
const router = express.Router();

const {
  getAllStaffController,
  getStaffController,
  getStaffByDepartmentController,
  addNewStaffController,
  updateStaffInfoController,
  deleteStaffController,
} = require("../controllers/staffController");

// STAFF Routes

// GET will send undefined (for specific id search) or empty array (for collection search) if there is no result from mysql, otherwise it will send the result in object or array of objects
// POST will send error object including error msg if failed to insert data, otherwise it will send the newly inserted object
// PUT same with POST but for update
// DELETE will send error object including error msg if failed to delete data, otherwise it will send nothing (No Content) when successfully deleted

router.get("/", getAllStaffController);
router.get("/:id", getStaffController);
router.get("/by-department/:departmentID", getStaffByDepartmentController);
router.post("/", addNewStaffController);
router.put("/:id", updateStaffInfoController);
router.delete("/:staffID", deleteStaffController);

module.exports = router;
