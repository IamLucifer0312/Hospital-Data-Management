const express = require("express");
const {
  addNewStaff,
  getStaff,
  getAllStaff,
  getStaffByDepartment,
  updateStaffInfo,
  getStaffSchedulesByStaff,
  updateStaffSchedule,
  addStaffSchedule,
  deleteStaffSchedule,
  getStaffSchedule,
} = require("./database");

const app = express();
const port = 3000;

app.use(express.json());

// Staff
app.get("/staff", async (req, res) => {
  const result = await getAllStaff();
  res.send(result);
});
app.get("/staff/:id", async (req, res) => {
  const result = await getStaff(req.params.id);
  res.send(result);
});
app.get("/staff/by-department/:departmentID", async (req, res) => {
  const result = await getStaffByDepartment(req.params.departmentID);
  res.send(result);
});

app.post("/staff", async (req, res) => {
  const {
    firstName,
    lastName,
    jobType,
    salary,
    qualification,
    departmentID,
    managerID,
  } = req.body;
  try {
    const result = await addNewStaff(
      firstName,
      lastName,
      jobType,
      salary,
      qualification,
      departmentID,
      managerID
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/staff/:id", async (req, res) => {
  const {
    firstName,
    lastName,
    jobType,
    salary,
    qualification,
    departmentID,
    managerID,
  } = req.body;
  try {
    const result = await updateStaffInfo(
      req.params.id,
      firstName,
      lastName,
      jobType,
      salary,
      qualification,
      departmentID,
      managerID
    );
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Staff Schedules
app.get("/staff/:staffID/schedules/:scheduleID", async (req, res) => {
  const result = await getStaffSchedule(req.params.scheduleID);
  res.send(result);
});
app.get("/staff/:staffID/schedules", async (req, res) => {
  const result = await getStaffSchedulesByStaff(req.params.staffID);
  res.send(result);
});
app.post("/staff/:staffID/schedules/", async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  try {
    const result = await addStaffSchedule(
      req.params.staffID,
      dayOfWeek,
      startTime,
      endTime
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/staff/:staffID/schedules/:scheduleID", async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  try {
    const result = await updateStaffSchedule(
      req.params.scheduleID,
      req.params.staffID,
      dayOfWeek,
      startTime,
      endTime
    );
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/staff/:staffID/schedules/:scheduleID", async (req, res) => {
  try {
    const result = await deleteStaffSchedule(req.params.scheduleID);
    res.status(204).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
