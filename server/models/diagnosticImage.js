const mongoose = require("mongoose");

const diagnosticImageSchema = new mongoose.Schema(
  {
    PatientID: Number,
    AppointmentID: Number,
    ImageType: String,
    ImageURL: String,
    Date: Date,
    Description: { type: String, required: false },
  },
  {
    versionKey: false, // Prevents the `__v` field from being added
  }
);

module.exports = mongoose.model("diagnosticImage", diagnosticImageSchema);
