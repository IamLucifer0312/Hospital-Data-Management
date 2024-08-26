const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(
  "mongodb+srv://trongtiennew:031204@cluster0.329iaib.mongodb.net/Hospital"
);

const NoteSchema = new mongoose.Schema({
  PatientID: Number,
  AppointmentID: Number,
  DoctorID: Number,
  Note: String,
});

const Note = mongoose.model("notes", NoteSchema);

app.get("/getNotes", async (req, res) => {
  try {
    const notes = await Note.find();
    if (notes.length === 0) {
      res.status(404).send("No notes found");
    } else {
      res.json(notes);
    }
    res.json(notes);
    console.log(notes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
