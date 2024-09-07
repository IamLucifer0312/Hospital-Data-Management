const mongoose = require("mongoose");

const trainingMaterialsSchema = new mongoose.Schema(
  {
    TrainingName: String,
    Department: String,
    DocumentURL: String,
  },
  {
    versionKey: false, // Prevents the `__v` field from being added
    collection: "trainingMaterials",
  }
);

module.exports = mongoose.model("trainingMaterials", trainingMaterialsSchema);
