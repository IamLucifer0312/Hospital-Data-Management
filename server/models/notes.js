const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    PatientID: Number,
    AppointmentID: Number,
    DoctorID: Number,
    Note: String,
  },
  {
    versionKey: false, // Prevents the `__v` field from being added
  }
);

module.exports = mongoose.model("notes", NoteSchema);
