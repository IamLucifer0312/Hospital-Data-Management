const express = require("express");
const { model, default: mongoose } = require("mongoose");
const router = express.Router();
const LabResults = require("../models/labResults");
const multer = require("multer");
const db = mongoose.connection;

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File naming convention
  },
});

const upload = multer({ storage: storage });

// Get all results
router.get("/", async (req, res) => {
  try {
    const labResults = await LabResults.find();
    if (labResults.length === 0) {
      res.status(404).send("No items found");
    } else {
      res.json(labResults);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get one result
router.get("/:id", getLabResult, (req, res) => {
  res.send(res.labResult);
});

// Create one result
router.post("/", async (req, res) => {
  // Create a new lab result document
  const labResult = new LabResults({
    PatientID: req.body.PatientID,
    PatientName: req.body.PatientName,
    StaffInCharge: req.body.StaffID,
    TestType: req.body.TestType,
    Result: req.body.Result,
    ReferenceValue: req.body.ReferenceValue,
    Unit: req.body.Unit,
    TestDate: req.body.TestDate,
  });
  try {
    const newResult = await labResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one result
router.patch("/:id", getLabResult, async (req, res) => {
  if (req.body.PatientID != null) {
    res.labResult.PatientID = req.body.PatientID;
  }
  if (req.body.StaffID != null) {
    res.labResult.StaffID = req.body.StaffID;
  }
  if (req.body.TestType != null) {
    res.labResult.TestType = req.body.TestType;
  }
  if (req.body.Result != null) {
    res.labResult.Result = req.body.Result;
  }
  if (req.body.ReferenceValue != null) {
    res.labResult.ReferenceValue = req.body.ReferenceValue;
  }
  if (req.body.Unit != null) {
    res.labResult.Unit = req.body.Unit;
  }
  if (req.body.TestDate != null) {
    res.labResult.TestDate = req.body.TestDate;
  }
  try {
    const updatedLabResult = await res.labResult.save();
    res.json(updatedLabResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete one result
router.delete("/:id", getLabResult, async (req, res) => {
  try {
    await res.labResult.remove();
    res.json({ message: "Deleted lab result" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware function to get a single lab result by ID

async function getLabResult(req, res, next) {
  let labResult;
  try {
    labResult = await LabResults.findById(req.params.id);
    if (labResult == null) {
      return res.status(404).json({ message: "Lab result not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.labResult = labResult;
  next();
}

module.exports = router;
