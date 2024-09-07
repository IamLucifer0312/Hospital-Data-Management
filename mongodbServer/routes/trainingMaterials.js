const express = require("express");
const { model, default: mongoose } = require("mongoose");
const router = express.Router();
const TrainingMaterials = require("../models/trainingMaterials");
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

// Get all training materials
router.get("/", async (req, res) => {
  try {
    const trainingMaterials = await TrainingMaterials.find();
    if (trainingMaterials.length === 0) {
      res.status(404).send("No items found");
    } else {
      res.json(trainingMaterials);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get one training material
router.get("/:id", getTrainingMaterial, (req, res) => {
  res.send(res.trainingMaterial);
});

// Create one training material
router.post("/", upload.single("file"), async (req, res) => {
  const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Create a new training material document
  const trainingMaterial = new TrainingMaterials({
    TrainingName: req.body.TrainingName,
    Department: req.body.Department,
    DocumentURL: fileUrl,
  });
  try {
    const newMaterial = await trainingMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one training material
router.patch("/:id", getTrainingMaterial, async (req, res) => {
  if (req.body.TrainingName != null) {
    res.trainingMaterial.TrainingName = req.body.TrainingName;
  }
  if (req.body.Department != null) {
    res.trainingMaterial.Department = req.body.Department;
  }
  if (req.file) {
    res.trainingMaterial.DocumentURL = `/uploads/${req.file.filename}`;
  }
  try {
    const updatedMaterial = await res.trainingMaterial.save();
    res.json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete one training material
router.delete("/:id", getTrainingMaterial, async (req, res) => {
  try {
    await res.trainingMaterial.remove();
    res.json({ message: "Training material deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get training material by ID
async function getTrainingMaterial(req, res, next) {
  let trainingMaterial;
  try {
    trainingMaterial = await TrainingMaterials.findById(req.params.id);
    if (trainingMaterial == null) {
      return res.status(404).json({ message: "Training material not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.trainingMaterial = trainingMaterial;
  next();
}

module.exports = router;
