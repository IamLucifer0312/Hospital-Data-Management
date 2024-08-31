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
router.get("/:id", getPatientController);
router.post("/", addNewPatientController);
router.put("/:id", updatePatientInfoController);
router.delete("/:patientID", deletePatientController);

module.exports = router;
