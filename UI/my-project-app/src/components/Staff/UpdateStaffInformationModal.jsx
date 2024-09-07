import React, { useState } from "react";

const UpdateStaffInformationModal = ({ staff, closeModal, onUpdate }) => {
  const [firstName, setFirstName] = useState(staff.FirstName);
  const [lastName, setLastName] = useState(staff.LastName);
  const [jobType, setJobType] = useState(staff.JobType);
  const [salary, setSalary] = useState(staff.Salary);
  const [qualification, setQualification] = useState(staff.Qualification);
  const [departmentID, setDepartmentID] = useState(staff.DepartmentID);
  const [managerID, setManagerID] = useState(staff.ManagerID || null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedStaff = {
      firstName,
      lastName,
      jobType,
      salary,
      qualification,
      departmentID,
      managerID,
    };

    try {
      const response = await fetch(
        `http://localhost:4000/staffs/${staff.StaffID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedStaff),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update staff information");
      }

      const result = await response.json();
      onUpdate(result);
      setSuccessMessage("Update successfully!");
    } catch (err) {
      console.error(err);
      setSuccessMessage("Failed to update information.");
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-500 text-center uppercase">
          Update Staff Information
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Job Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Admin">Admin</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Surgeon">Surgeon</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Salary
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Qualification
            </label>
            <input
              type="text"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Department
            </label>
            <input
              type="text"
              value={departmentID}
              onChange={(e) => setDepartmentID(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Manager ID
            </label>
            <input
              type="text"
              value={managerID}
              onChange={(e) => setManagerID(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Information
            </button>
          </div>
        </form>
        {successMessage && (
          <p className="mt-4 uppercase font-bold  text-center text-green-600">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default UpdateStaffInformationModal;
