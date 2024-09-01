const express = require("express");
const router = express.Router();

const {
  getAllStaffController,
  getStaffController,
  getStaffByDepartmentController,
  addNewStaffController,
  updateStaffInfoController,
  deleteStaffController,
  getAllDepartmentController,
} = require("../controllers/staffController");

// STAFF Routes

// GET will send undefined (for specific id search) or empty array (for collection search) if there is no result from mysql, otherwise it will send the result in object or array of objects
// POST will send error object including error msg if failed to insert data, otherwise it will send the newly inserted object
// PUT same with POST but for update
// DELETE will send error object including error msg if failed to delete data, otherwise it will send nothing (No Content) when successfully deleted

// department routes
router.get("/department", getAllDepartmentController);
router.get("/department/:departmentId", getStaffByDepartmentController);

// staff-related routes
router.get("/", getAllStaffController);
router.get("/:staffId", getStaffController);
router.post("/", addNewStaffController);
router.put("/:staffId", updateStaffInfoController);
router.delete("/:staffId", deleteStaffController);

module.exports = router;
