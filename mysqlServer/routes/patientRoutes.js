const express = require("express");
const router = express.Router();

const {
  getAllPatientController,
  getPatientController,
  addNewPatientController,
  updatePatientInfoController,
  deletePatientController,
} = require("../controllers/patientController");

// PATIENT Routes

router.get("/", getAllPatientController);
router.get("/:patientId", getPatientController);
router.post("/", addNewPatientController);
router.put("/:patientId", updatePatientInfoController);
router.delete("/:patientId", deletePatientController);

module.exports = router;
