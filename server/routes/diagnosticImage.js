const express = require("express");
const { model, default: mongoose } = require("mongoose");
const router = express.Router();
const DiagnosticImage = require("../models/diagnosticImage");
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

// Get all notes
router.get("/", async (req, res) => {
  try {
    const diagnosticImages = await DiagnosticImage.find();
    if (notes.length === 0) {
      res.status(404).send("No items found");
    } else {
      res.json(diagnosticImages);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// // Get one note
router.get("/:id", upload.single("image"), (req, res) => {
  res.send(res.diagnosticImage);
});

// Create one note
router.post("/", async (req, res) => {
  console.log(req);
  const diagnosticImage = new DiagnosticImage({
    PatientID: req.body.PatientID,
    AppointmentID: req.body.AppointmentID,
    ImageType: req.body.ImageType,
    ImageURL: req.file ? req.file.path : null, // Store the file path in ImageURL
    Date: req.body.Date,
    Description: req.body.Description,
  });

  try {
    const newImage = await diagnosticImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one note
router.patch("/:id", getDiagnosticImage, async (req, res) => {
  if (req.body.PatientID != null) {
    res.diagnosticImage.PatientID = req.body.PatientID;
  }
  if (req.body.AppointmentID != null) {
    res.diagnosticImage.AppointmentID = req.body.AppointmentID;
  }
  if (req.body.ImageType != null) {
    res.diagnosticImage.ImageType = req.body.ImageType;
  }
  if (req.file != null) {
    res.diagnosticImage.ImageURL = req.file.path; // Update with new file path if uploaded
  }
  if (req.body.Date != null) {
    res.diagnosticImage.Date = req.body.Date;
  }
  if (req.body.Description != null) {
    res.diagnosticImage.Description = req.body.Description;
  }
  try {
    const updatedImage = await res.diagnosticImage.save();
    res.json(updatedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // Delete one note
router.delete("/:id", getDiagnosticImage, async (req, res) => {
  try {
    await res.note.deleteOne();
    res.json({ message: "Deleted item" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getDiagnosticImage(req, res, next) {
  let note;
  try {
    diagnosticImage = await DiagnosticImage.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: "Cannot find item" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.diagnosticImage = diagnosticImage;
  next();
}

module.exports = router;
