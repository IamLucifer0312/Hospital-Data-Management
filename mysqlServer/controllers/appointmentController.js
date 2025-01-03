const {
  getAllAppointment,
  getAppointment,
  getAppointmentsByPatient,
  getAppointmentsByStaff,
  getAppointmentsByPatientAndStaff,
  addNewAppointment,
  updateAppointmentInfo,
  deleteAppointment,
  bookDoctorAppointment,
  cancelAppointment,
} = require("../database");

const getAllAppointmentController = async (req, res) => {
  try {
    const result = await getAllAppointment();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAppointmentController = async (req, res) => {
  try {
    const result = await getAppointment(req.params.appointmentId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAppointmentsByPatientController = async (req, res) => {
  try {
    const result = await getAppointmentsByPatient(req.params.patientId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAppointmentsByStaffController = async (req, res) => {
  try {
    const result = await getAppointmentsByStaff(req.params.staffId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAppointmentsByPatientAndStaffController = async (req, res) => {
  try {
    const result = await getAppointmentsByPatientAndStaff(
      req.params.patientId,
      req.params.staffId
    );
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addNewAppointmentController = async (req, res) => {
  const {
    appointmentDate,
    appointmentStartTime,
    appointmentEndTime,
    appointmentStatus,
    purpose,
    patientID,
    staffID,
  } = req.body;

  try {
    const result = await addNewAppointment(
      appointmentDate,
      appointmentStartTime,
      appointmentEndTime,
      appointmentStatus,
      purpose,
      patientID,
      staffID
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateAppointmentInfoController = async (req, res) => {
  const {
    appointmentDate,
    appointmentStartTime,
    appointmentEndTime,
    appointmentStatus,
    purpose,
    patientID,
    staffID,
  } = req.body;

  try {
    const result = await updateAppointmentInfo(
      req.params.appointmentId,
      appointmentDate,
      appointmentStartTime,
      appointmentEndTime,
      appointmentStatus,
      purpose,
      patientID,
      staffID
    );
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const deleteAppointmentController = async (req, res) => {
  try {
    await deleteAppointment(req.params.appointmentId);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

const bookDoctorAppointmentController = async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      appointmentDate,
      startTime,
      endTime,
      purpose,
    } = req.body;
    const resultMessage = await bookDoctorAppointment(
      doctorId,
      patientId,
      appointmentDate,
      startTime,
      endTime,
      purpose
    );
    res.send({ message: resultMessage });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal server error", error: err.message });
  }
};

const cancelAppointmentController = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const result = await cancelAppointment(appointmentId);
    res
      .status(200)
      .send({ message: "Appointment cancelled successfully", result });
  } catch (err) {
    console.error("Error cancelling appointment:", err);
    res
      .status(500)
      .send({ message: err.sqlMessage || "Failed to cancel appointment" });
  }
};

module.exports = {
  getAllAppointmentController,
  getAppointmentController,
  getAppointmentsByPatientController,
  getAppointmentsByStaffController,
  getAppointmentsByPatientAndStaffController,
  addNewAppointmentController,
  updateAppointmentInfoController,
  deleteAppointmentController,
  bookDoctorAppointmentController,
  cancelAppointmentController,
};
