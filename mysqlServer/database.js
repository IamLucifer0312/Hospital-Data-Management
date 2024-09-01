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

//STAFF
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
  return rows[0]; //undefined if no staff found
}
async function getStaffByDepartment(id) {
  const [rows] = await connection.query(
    "SELECT * FROM staff WHERE DepartmentID = ?",
    [id] //avoid sql injection
  );
  console.log(rows);
  return rows; //empty array if no staff found
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
async function deleteStaff(StaffID) {
  const [rows] = await connection.query("CALL sp_delete_staff(?)", [StaffID]);
  console.log(rows);
  return rows;
}

// STAFF SCHEDULES
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

// PATIENT
async function getAllPatient() {
  const [rows] = await connection.query("SELECT * FROM patients");
  console.log(rows);
  return rows;
}

async function getPatient(id) {
  const [rows] = await connection.query(
    "SELECT * FROM patient WHERE PatientID = ?",
    [id] //avoid sql injection
  );
  console.log(rows[0]);
  return rows[0]; //undefined if no patients found
}

async function addNewPatient(
  firstName,
  lastName,
  dateOfBirth,
  gender,
  address,
  phoneNum,
  email,
  allergies
) {
  const [rows] = await connection.query(
    "CALL sp_add_new_patient(?,?,?,?,?,?,?,?)",
    [
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      phoneNum,
      email,
      allergies,
    ]
  );
  console.log(rows[0][0]);
  return rows[0][0];
}

async function updatePatientInfo(
  patientID,
  firstName,
  lastName,
  dateOfBirth,
  gender,
  address,
  phoneNum,
  email,
  allergies
) {
  const [rows] = await connection.query(
    "CALL sp_update_patient(?,?,?,?,?,?,?,?,?)",
    [
      patientID,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      phoneNum,
      email,
      allergies,
    ]
  );
  console.log(rows[0][0]);
  return rows[0][0];
}

async function deletePatient(PatientID) {
  const [rows] = await connection.query("CALL sp_delete_patient(?)", [
    PatientID,
  ]);
}

//DEPARTMENT
async function getAllDepartment() {
  const [rows] = await connection.query("SELECT * FROM department");
  console.log(rows);
  return rows;
}

// APPOINTMENT
async function getAllAppointment() {
  const query = `
    SELECT 
      a.AppointmentID,
      a.AppointmentDate,
      a.AppointmentStartTime,
      a.AppointmentEndTime,
      a.AppointmentStatus,
      a.Purpose,
      p.FirstName AS PatientFirstName,
      p.LastName AS PatientLastName,
      p.PhoneNum AS PatientPhoneNum,
      s.FirstName AS DoctorFirstName,
      s.LastName AS DoctorLastName,
      s.Qualification AS DoctorQualification
    FROM 
      Appointments a
    INNER JOIN 
      Patients p ON a.PatientID = p.PatientID
    INNER JOIN 
      Staff s ON a.StaffID = s.StaffID
    WHERE 
      s.JobType = 'Doctor';
  `;
  const [rows] = await connection.query(query);
  console.log(rows);
  return rows;
}

async function getAppointment(id) {
  const [rows] = await connection.query(
    "SELECT * FROM appointments WHERE AppointmentID = ?",
    [id]
  );
  console.log(rows[0]);
  return rows[0];
}

async function getAppointmentsByPatient(patientId) {
  const [rows] = await connection.query(
    "SELECT * FROM appointments WHERE PatientID = ?",
    [patientId]
  );
  console.log(rows);
  return rows;
}

async function getAppointmentsByStaff(staffId) {
  const [rows] = await connection.query(
    "SELECT * FROM appointments WHERE StaffID = ?",
    [staffId]
  );
  console.log(rows);
  return rows;
}

async function getAppointmentsByPatientAndStaff(patientId, staffId) {
  const [rows] = await connection.query(
    "SELECT * FROM appointments WHERE PatientID = ? AND StaffID = ?",
    [patientId, staffId] // Using both patientId and staffId to filter results
  );
  console.log(rows); // Log the rows for debugging purposes
  return rows; // Return the filtered appointments
}

async function addNewAppointment(
  appointmentDate,
  appointmentStartTime,
  appointmentEndTime,
  appointmentStatus,
  purpose,
  patientID,
  staffID
) {
  const [rows] = await connection.query(
    "CALL sp_add_new_appointment(?,?,?,?,?,?,?)",
    [
      appointmentDate,
      appointmentStartTime,
      appointmentEndTime,
      appointmentStatus,
      purpose,
      patientID,
      staffID,
    ]
  );
  console.log(rows[0][0]);
  return rows[0][0];
}

async function updateAppointmentInfo(
  appointmentID,
  appointmentDate,
  appointmentStartTime,
  appointmentEndTime,
  appointmentStatus,
  purpose,
  patientID,
  staffID
) {
  const [rows] = await connection.query(
    "CALL sp_update_appointment(?,?,?,?,?,?,?,?)",
    [
      appointmentID,
      appointmentDate,
      appointmentStartTime,
      appointmentEndTime,
      appointmentStatus,
      purpose,
      patientID,
      staffID,
    ]
  );
  console.log(rows[0][0]);
  return rows[0][0];
}

async function deleteAppointment(appointmentID) {
  const [rows] = await connection.query("CALL sp_delete_appointment(?)", [
    appointmentID,
  ]);
  console.log(rows);
  return rows;
}

async function getStaffScheduleGivenTime(startDate, endDate) {
  const [rows] = await connection.query("CALL get_doctor_schedule(?, ?)", [
    startDate,
    endDate,
  ]);
  return rows[0];
}

async function bookDoctorAppointment(
  doctorId,
  patientId,
  appointmentDate,
  startTime,
  endTime,
  purpose
) {
  const [rows] = await connection.query(
    `
    CALL book_appointment(?, ?, ?, ?, ?, ?, @resultMessage);
    SELECT @resultMessage AS resultMessage;
  `,
    [doctorId, patientId, appointmentDate, startTime, endTime, purpose]
  );

  const resultMessage = rows[1][0].resultMessage;

  return resultMessage;
}

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
  deleteStaff,
  getAllPatient,
  getPatient,
  addNewPatient,
  updatePatientInfo,
  deletePatient,
  getAllDepartment,
  getAllAppointment,
  getAppointment,
  getAppointmentsByPatient,
  getAppointmentsByStaff,
  getAppointmentsByPatientAndStaff,
  addNewAppointment,
  updateAppointmentInfo,
  deleteAppointment,
  getStaffScheduleGivenTime,
  bookDoctorAppointment,
};
