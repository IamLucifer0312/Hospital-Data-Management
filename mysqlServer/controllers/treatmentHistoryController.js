const {
  getTreatmentHistory,
  getAllTreatmentHistory,
  addTreatmentHistory,
} = require("../database");

const getTreatmentHistoryController = async (req, res) => {
  try {
    const result = await getTreatmentHistory(req.params.treatmentHistoryId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllTreatmentHistoryController = async (req, res) => {
  try {
    const result = await getAllTreatmentHistory();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addTreatmentHistoryController = async (req, res) => {
  try {
    const {
      patientID,
      doctorID,
      startDate,
      endDate,
      treatmentType,
      billingAmount,
      status,
      details,
    } = req.body;
    const result = await addTreatmentHistory(
      patientID,
      doctorID,
      startDate,
      endDate,
      treatmentType,
      billingAmount,
      status,
      details
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getTreatmentHistoryController,
  getAllTreatmentHistoryController,
  addTreatmentHistoryController,
};
