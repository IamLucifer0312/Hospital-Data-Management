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
    if (diagnosticImages.length === 0) {
      res.status(404).send("No items found");
    } else {
      res.json(diagnosticImages);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// // Get one note
router.get("/:id", getDiagnosticImage, (req, res) => {
  res.send(res.diagnosticImage);
});

// Create one note
router.post("/", upload.single("image"), async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Create a new diagnostic image document
  const diagnosticImage = new DiagnosticImage({
    PatientID: req.body.PatientID,
    StaffID: req.body.StaffID,
    ImageType: req.body.ImageType,
    ImageURL: imageUrl,
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
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    // Find the document by ID
    const diagnosticImage = await DiagnosticImage.findById(req.params.id);

    if (!diagnosticImage) {
      return res.status(404).json({ message: "Diagnostic Image not found" });
    }

    // Update the fields if they are provided in the request
    if (req.body.PatientID) {
      diagnosticImage.PatientID = req.body.PatientID;
    }
    if (req.body.StaffID) {
      diagnosticImage.StaffID = req.body.StaffID;
    }
    if (req.body.ImageType) {
      diagnosticImage.ImageType = req.body.ImageType;
    }
    if (req.body.Date) {
      diagnosticImage.Date = req.body.Date;
    }
    if (req.body.Description) {
      diagnosticImage.Description = req.body.Description;
    }

    // If a new image is uploaded, update the ImageURL field
    if (req.file) {
      diagnosticImage.ImageURL = `/uploads/${req.file.filename}`;
    }

    // Save the updated document
    const updatedImage = await diagnosticImage.save();
    res.json(updatedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // Delete one note
router.delete("/:id", getDiagnosticImage, async (req, res) => {
  try {
    await res.diagnosticImage.deleteOne();
    res.json({ message: "Deleted item" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getDiagnosticImage(req, res, next) {
  let diagnosticImage;
  try {
    diagnosticImage = await DiagnosticImage.findById(req.params.id);
    if (diagnosticImage == null) {
      return res.status(404).json({ message: "Cannot find item" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.diagnosticImage = diagnosticImage;
  next();
}

module.exports = router;
