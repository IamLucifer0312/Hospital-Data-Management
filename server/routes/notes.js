const express = require("express");
const { model, default: mongoose } = require("mongoose");
const router = express.Router();
const Note = require("../models/notes");
const db = mongoose.connection;

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    if (notes.length === 0) {
      res.status(404).send("No notes found");
    } else {
      res.json(notes);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// // Get one note
// router.get("/:id", getNote, (req, res) => {
//   res.json(res.note);
// });

// Create one note
router.post("/", async (req, res) => {
  const note = new Note({
    PatientID: req.body.PatientID,
    AppointmentID: req.body.AppointmentID,
    DoctorID: req.body.DoctorID,
    Note: req.body.Note,
  });
  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // Update one note
// router.patch("/:id", getNote, async (req, res) => {
//   if (req.body.PatientID != null) {
//     res.note.PatientID = req.body.PatientID;
//   }
//   if (req.body.AppointmentID != null) {
//     res.note.AppointmentID = req.body.AppointmentID;
//   }
//   if (req.body.DoctorID != null) {
//     res.note.DoctorID = req.body.DoctorID;
//   }
//   if (req.body.Note != null) {
//     res.note.Note = req.body.Note;
//   }
//   try {
//     const updatedNote = await res.note.save();
//     res.json(updatedNote);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Delete one note
// router.delete("/:id", getNote, async (req, res) => {
//   try {
//     await res.note.remove();
//     res.json({ message: "Deleted note" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
