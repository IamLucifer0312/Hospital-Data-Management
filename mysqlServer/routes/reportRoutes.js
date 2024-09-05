const express = require("express");
const router = express.Router();

const {
  getPatientTreatmentHistoryOnDurationController,
  getAllPatientsTreatmentOnDurationController,
  getJobChangeHistoryController,
  getDoctorWorkController,
  getAllDoctorsWorkController,
} = require("../controllers/reportController");

router.get(
  "/patient-treatments/:patientID",
  getPatientTreatmentHistoryOnDurationController
);

router.get(
  "/all-patient-treatments",
  getAllPatientsTreatmentOnDurationController
);
router.get("/job-change-history/:staffID", getJobChangeHistoryController);
router.get("/doctor-work/:staffID", getDoctorWorkController);
router.get("/all-doctors-work", getAllDoctorsWorkController);

module.exports = router;