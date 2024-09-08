const {
  getStaffSchedule,
  getStaffSchedulesByStaff,
  addStaffSchedule,
  updateStaffSchedule,
  deleteStaffSchedule,
  getStaffScheduleGivenTime,
} = require("../database");

const getStaffScheduleController = async (req, res) => {
  try {
    const result = await getStaffSchedule(req.params.scheduleId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getStaffSchedulesByStaffController = async (req, res) => {
  try {
    const result = await getStaffSchedulesByStaff(req.params.staffId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addStaffScheduleController = async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;

  try {
    const result = await addStaffSchedule(
      req.params.staffId,
      dayOfWeek,
      startTime,
      endTime
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateStaffScheduleController = async (req, res) => {
  const { dayOfWeek, startTime, endTime } = req.body;
  try {
    const result = await updateStaffSchedule(
      req.params.scheduleId,
      req.params.staffId,
      dayOfWeek,
      startTime,
      endTime
    );
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const deleteStaffScheduleController = async (req, res) => {
  try {
    await deleteStaffSchedule(req.params.scheduleId);
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getDoctorScheduleByGivenTimeController = async (req, res) => {
  try {
    const result = await getStaffScheduleGivenTime(
      req.body.startDate,
      req.body.endDate
    );
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getStaffScheduleController,
  getStaffSchedulesByStaffController,
  addStaffScheduleController,
  updateStaffScheduleController,
  deleteStaffScheduleController,
  getDoctorScheduleByGivenTimeController,
};
