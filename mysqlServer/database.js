const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql
  .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "Hospital",
  })
  .promise();

//Staff
async function getAllStaff() {
  const [rows] = await connection.query("SELECT * FROM staff");
  console.log(rows);
  return rows;
}
async function getStaff(id) {
  const [rows] = await connection.query(
    "SELECT * FROM staff WHERE StaffID = ?",
    [id] //avoid sql injection
  );
  console.log(rows[0]);
  return rows[0];
}
async function getStaffByDepartment(id) {
  const [rows] = await connection.query(
    "SELECT * FROM staff WHERE DepartmentID = ?",
    [id] //avoid sql injection
  );
  console.log(rows);
  return rows;
}
async function addNewStaff(
  firstName,
  lastName,
  jobType,
  salary,
  qualification,
  departmentID,
  managerID
) {
  const [rows] = await connection.query(
    "CALL sp_add_new_staff(?,?,?,?,?,?,?)",
    [
      firstName,
      lastName,
      jobType,
      salary,
      qualification,
      departmentID,
      managerID,
    ]
  );
  console.log(rows[0][0]);
  return rows[0][0];
}
async function updateStaffInfo(
  staffID,
  firstName,
  lastName,
  jobType,
  salary,
  qualification,
  departmentID,
  managerID
) {
  const [rows] = await connection.query(
    "CALL sp_update_staff(?,?,?,?,?,?,?,?)",
    [
      staffID,
      firstName,
      lastName,
      jobType,
      salary,
      qualification,
      departmentID,
      managerID,
    ]
  );
  console.log(rows[0][0]);
  return rows[0][0];
}

// Staff Schedules
async function getStaffSchedule(id) {
  const [rows] = await connection.query(
    "SELECT * FROM staff_schedule WHERE ScheduleID = ?",
    [id]
  );
  console.log(rows[0]);
  return rows[0];
}
async function getStaffSchedulesByStaff(staffId) {
  const [rows] = await connection.query(
    "SELECT * FROM Staff_Schedule WHERE StaffID = ?",
    [staffId] //avoid sql injection
  );
  console.log(rows);
  return rows;
}
async function addStaffSchedule(staffID, dayOfWeek, startTime, endTime) {
  const [rows] = await connection.query(
    "CALL sp_add_new_staff_schedule(?,?,?,?)",
    [staffID, dayOfWeek, startTime, endTime]
  );
  console.log(rows[0][0]);
  return rows[0][0];
}

async function updateStaffSchedule(
  scheduleID,
  staffID,
  dayOfWeek,
  startTime,
  endTime
) {
  const [rows] = await connection.query(
    "CALL sp_update_staff_schedule(?,?,?,?,?)",
    [scheduleID, staffID, dayOfWeek, startTime, endTime]
  );
  console.log(rows[0][0]);
  return rows[0][0];
}

async function deleteStaffSchedule(scheduleID) {
  const [rows] = await connection.query("CALL sp_delete_staff_schedule(?)", [
    scheduleID,
  ]);
  console.log(rows);
  return rows;
}

// getStaff(1);
// addStaff("Nguyen", "Van Anh", "Doctor", 120000, "MD Cardiology", 6, null);
module.exports = {
  getStaff,
  addNewStaff,
  getAllStaff,
  getStaffByDepartment,
  updateStaffInfo,
  getStaffSchedulesByStaff,
  addStaffSchedule,
  updateStaffSchedule,
  deleteStaffSchedule,
  getStaffSchedule,
};
