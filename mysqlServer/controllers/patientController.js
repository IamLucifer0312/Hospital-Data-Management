const {
  getAllPatient,
  getPatient,
  addNewPatient,
  updatePatientInfo,
  deletePatient,
} = require("../database");

const getAllPatientController = async (req, res) => {
  try {
    const result = await getAllPatient();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getPatientController = async (req, res) => {
  try {
    const result = await getPatient(req.params.patientId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addNewPatientController = async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    phoneNum,
    email,
    allergies,
  } = req.body;

  try {
    const result = await addNewPatient(
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      phoneNum,
      email,
      allergies
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updatePatientInfoController = async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    phoneNum,
    email,
    allergies,
  } = req.body;

  try {
    const result = await updatePatientInfo(
      req.params.patientId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      phoneNum,
      email,
      allergies
    );
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const deletePatientController = async (req, res) => {
  try {
    await deletePatient(req.params.patientId);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAllPatientController,
  getPatientController,
  addNewPatientController,
  updatePatientInfoController,
  deletePatientController,
};
