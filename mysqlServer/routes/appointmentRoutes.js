const express = require("express");
const router = express.Router();

const {
  getAllAppointmentController,
  getAppointmentController,
  getAppointmentsByPatientController,
  getAppointmentsByStaffController,
  getAppointmentsByPatientAndStaffController,
  addNewAppointmentController,
  updateAppointmentInfoController,
  deleteAppointmentController,
  bookDoctorAppointmentController,
  cancelAppointmentController,
} = require("../controllers/appointmentController");

// APPOINTMENT Routes
router.get("/", getAllAppointmentController);
router.get("/:appointmentId", getAppointmentController);
router.get("/patient/:patientId", getAppointmentsByPatientController);
router.get("/staff/:staffId", getAppointmentsByStaffController);
router.get(
  "/patient/:patientId/staff/:staffId",
  getAppointmentsByPatientAndStaffController
);
router.post("/", addNewAppointmentController);
router.put("/:appointmentId", updateAppointmentInfoController);
router.delete("/:appointmentId", deleteAppointmentController);
router.post("/book", bookDoctorAppointmentController);
router.put("/:appointmentId/cancel", cancelAppointmentController);

module.exports = router;
