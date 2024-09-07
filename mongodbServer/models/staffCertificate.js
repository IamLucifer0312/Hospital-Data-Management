const mongoose = require("mongoose");

const staffCertificateSchema = new mongoose.Schema(
  {
    StaffID: Number,
    StaffName: String,
    ImageURL: String,
  },
  {
    versionKey: false, // Prevents the `__v` field from being added
    collection: "staffCertificates",
  }
);

module.exports = mongoose.model("staffCertificate", staffCertificateSchema);
