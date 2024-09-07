const express = require("express");
const { model, default: mongoose } = require("mongoose");
const router = express.Router();
const StaffCertificate = require("../models/staffCertificate");
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

// Get all certificates
router.get("/", async (req, res) => {
  try {
    const staffCertificates = await StaffCertificate.find();
    if (staffCertificates.length === 0) {
      res.status(404).send("No items found");
    } else {
      res.json(staffCertificates);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get one certificate
router.get("/:id", getStaffCertificate, (req, res) => {
  res.send(res.staffCertificate);
});

// Get certificates by staff ID
router.get("/staff/:id", async (req, res) => {
  try {
    const staffCertificates = await StaffCertificate.find({
      StaffID: req.params.id,
    });
    if (staffCertificates.length === 0) {
      res.status(404).send("No items found");
    } else {
      res.json(staffCertificates);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create one certificate
router.post("/", upload.single("image"), async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  // Create a new staff certificate document
  const staffCertificate = new StaffCertificate({
    StaffID: req.body.StaffID,
    StaffName: req.body.StaffName,
    ImageURL: imageUrl,
  });
  try {
    const newCertificate = await staffCertificate.save();
    res.status(201).json(newCertificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one certificate
router.patch(
  "/:id",
  getStaffCertificate,
  upload.single("image"),
  async (req, res) => {
    if (req.body.StaffID != null) {
      res.staffCertificate.StaffID = req.body.StaffID;
    }
    if (req.body.StaffName != null) {
      res.staffCertificate.StaffName = req.body.StaffName;
    }
    if (req.file) {
      res.staffCertificate.ImageURL = `/uploads/${req.file.filename}`;
    }
    try {
      const updatedCertificate = await res.staffCertificate.save();
      res.json(updatedCertificate);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Delete one certificate

router.delete("/:id", getStaffCertificate, async (req, res) => {
  try {
    await res.staffCertificate.remove();
    res.json({ message: "Certificate deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to get certificate by ID

async function getStaffCertificate(req, res, next) {
  let staffCertificate;
  try {
    staffCertificate = await StaffCertificate.findById(req.params.id);
    if (staffCertificate == null) {
      return res.status(404).json({ message: "Certificate not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.staffCertificate = staffCertificate;
  next();
}

module.exports = router;
