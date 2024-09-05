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
    const result = await addTreatmentHistory(
      req.params.patientId,
      req.params.doctorId,
      req.params.startDate,
      req.params.endDate,
      req.params.treatmentType,
      req.params.billingAmount,
      req.params.status,
      req.params.details
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
