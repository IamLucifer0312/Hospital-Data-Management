const express = require("express");
const { model, default: mongoose } = require("mongoose");
const router = express.Router();
const Users = require("../models/users");
const db = mongoose.connection;
const multer = require("multer");
const bcrypt = require("bcrypt");

// Set up multer for file uploads (ensure formdata post is not empty)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File naming convention
  },
});

const upload = multer({ storage: storage });

// Get all notes
router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.json(users);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Users.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        username: user.username,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: "Incorrect username or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// // Get one note
router.get("/:id", getUser, (req, res) => {
  res.send(res.user);
});

// Create one note
router.post("/", upload.none(), async (req, res) => {
  const user = new Users({
    role: req.body.role,
    username: req.body.username,
    password: req.body.password,
    profile_id: req.body.profile_id,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one note
router.patch("/:id", upload.none(), getUser, async (req, res) => {
  if (req.body.role != null) {
    res.user.role = req.body.role;
  }
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.profile_id != null) {
    res.user.profile_id = req.body.profile_id;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // Delete one note
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await Users.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

module.exports = router;
