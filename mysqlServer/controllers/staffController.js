const {
  getStaff,
  addNewStaff,
  getAllStaff,
  getStaffByDepartment,
  updateStaffInfo,
  deleteStaff,
  getAllDepartment,
} = require("../database");

const getAllStaffController = async (req, res) => {
  try {
    const result = await getAllStaff();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllDepartmentController = async (req, res) => {
  try {
    const result = await getAllDepartment();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getStaffController = async (req, res) => {
  try {
    const result = await getStaff(req.params.staffId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getStaffByDepartmentController = async (req, res) => {
  try {
    const result = await getStaffByDepartment(req.params.departmentId);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const addNewStaffController = async (req, res) => {
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
    console.log(err);
    res.status(500).send(err);
  }
};

const updateStaffInfoController = async (req, res) => {
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
      req.params.staffId,
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
};

const deleteStaffController = async (req, res) => {
  try {
    await deleteStaff(req.params.staffId);
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  getAllStaffController,
  getStaffController,
  getStaffByDepartmentController,
  addNewStaffController,
  updateStaffInfoController,
  deleteStaffController,
  getAllDepartmentController,
};
