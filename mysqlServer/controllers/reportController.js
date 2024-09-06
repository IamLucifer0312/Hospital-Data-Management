const {
  getPatientTreatmentHistoryOnDuration,
  getAllPatientsTreatmentOnDuration,
  getStaffJobHistory,
  getDoctorWorkInDuration,
  getAllDoctorsWorkInDuration,
} = require("../database");

const getPatientTreatmentHistoryOnDurationController = async (req, res) => {
  const { patientID } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const result = await getPatientTreatmentHistoryOnDuration(
      patientID,
      startDate,
      endDate
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllPatientsTreatmentOnDurationController = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const result = await getAllPatientsTreatmentOnDuration(startDate, endDate);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const getJobChangeHistoryController = async (req, res) => {
  const { staffID } = req.params;

  try {
    const result = await getStaffJobHistory(staffID);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getDoctorWorkController = async (req, res) => {
  const { staffID } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const result = await getDoctorWorkInDuration(staffID, startDate, endDate);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllDoctorsWorkController = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const result = await getAllDoctorsWorkInDuration(startDate, endDate);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPatientTreatmentHistoryOnDurationController,
  getAllPatientsTreatmentOnDurationController,
  getJobChangeHistoryController,
  getDoctorWorkController,
  getAllDoctorsWorkController,
};
