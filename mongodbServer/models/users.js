const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: String,
    username: String,
    password: String,
    profile_id: Number,
  },
  {
    versionKey: false, // Prevents the `__v` field from being added
  }
);

module.exports = mongoose.model("users", userSchema);
