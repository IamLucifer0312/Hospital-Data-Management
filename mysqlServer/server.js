const express = require("express");
const cors = require("cors");
const staffRoutes = require("./routes/staffRoutes");
const staffScheduleRoutes = require("./routes/staffScheduleRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const treatmentHistoryRoutes = require("./routes/treatmentHistoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/staffs", staffRoutes);
app.use("/schedules", staffScheduleRoutes);
app.use("/patients", patientRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/treatments", treatmentHistoryRoutes);
app.use("/reports", reportRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
