const express = require("express");
const cors = require("cors");
const staffRoutes = require("./routes/staffRoutes");
const staffScheduleRoutes = require("./routes/staffScheduleRoutes");
const patientRoutes = require("./routes/patientRoutes");

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/staff", staffRoutes);
app.use("/staff", staffScheduleRoutes);

app.use("/patient", patientRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
