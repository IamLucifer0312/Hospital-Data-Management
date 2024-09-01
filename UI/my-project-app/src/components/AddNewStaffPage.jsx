import React, { useState, useEffect } from "react";

const AddNewStaff = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobType, setJobType] = useState("Doctor");
  const [salary, setSalary] = useState("");
  const [qualification, setQualification] = useState("");
  const [departmentID, setDepartmentID] = useState("");
  const [managerID, setManagerID] = useState("");
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:4000/staffs/department");
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };

    const fetchManagers = async () => {
      try {
        const response = await fetch("http://localhost:4000/staffs");
        const data = await response.json();
        setManagers(data);
      } catch (err) {
        console.error("Failed to fetch managers:", err);
      }
    };

    fetchDepartments();
    fetchManagers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const newStaff = {
      firstName,
      lastName,
      jobType,
      salary,
      qualification,
      departmentID,
      managerID,
    };

    try {
      const response = await fetch("http://localhost:4000/staffs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStaff),
      });

      if (!response.ok) {
        throw new Error("Failed to add new staff");
      }

      const result = await response.json();
      setSuccess("Staff member added successfully!");
      setFirstName("");
      setLastName("");
      setJobType("Doctor");
      setSalary("");
      setQualification("");
      setDepartmentID("");
      setManagerID("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 uppercase text-center text-pretty text-teal-500">
        New Staff
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
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
            placeholder="Enter first name"
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
            placeholder="Enter last name"
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
            placeholder="Enter salary"
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
            placeholder="Enter qualification"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Department
          </label>
          <select
            value={departmentID}
            onChange={(e) => setDepartmentID(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select Department
            </option>
            {departments.map((department) => (
              <option
                key={department.DepartmentID}
                value={department.DepartmentID}
              >
                {department.DepartmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Manager
          </label>
          <select
            value={managerID}
            onChange={(e) => setManagerID(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="" disabled>
              Select Manager
            </option>
            {managers.map((manager) => (
              <option key={manager.StaffID} value={manager.StaffID}>
                {manager.FirstName} {manager.LastName} (ID: {manager.StaffID})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-teal-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Staff"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewStaff;
