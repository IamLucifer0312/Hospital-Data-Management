const mongoose = require("mongoose");

const labResultsSchema = new mongoose.Schema(
  {
    PatientID: Number,
    PatientName: String,
    Result: Number,
    StaffInCharge: Number,
    TestDate: Date,
    TestType: String,
    ReferenceValue: String,
    Unit: String,
  },
  {
    versionKey: false, // Prevents the `__v` field from being added
    collection: "labResults",
  }
);

module.exports = mongoose.model("labResults", labResultsSchema);
