import React, { useState, useEffect } from "react";
import DropDownMenu from "./DropDownMenu";
import UpdatePatientInformationModal from "./UpdatePatientInformationModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import AddDiagnosticImageModal from "./AddDiagnosticImageModal";
import { FaSearch } from "react-icons/fa";

const PatientTable = () => {
  const [patientData, setPatientData] = useState([]);
  const [filteredPatientData, setFilteredPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const handleUpdateInfo = (patient) => {
    setSelectedPatient(patient);
    setShowUpdateModal(true);
  };

  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const handleAddImage = (patient) => {
    setSelectedPatient(patient);
    setShowAddImageModal(true);
  };

  const handleUpdateSuccess = (updatedPatient) => {
    setPatientData((prevData) =>
      prevData.map((patient) =>
        patient.PatientID === updatedPatient.PatientID
          ? updatedPatient
          : patient
      )
    );
    setFilteredPatientData((prevData) =>
      prevData.map((patient) =>
        patient.PatientID === updatedPatient.PatientID
          ? updatedPatient
          : patient
      )
    );
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/patients/${selectedPatient.PatientID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete patient.");
      }
      setPatientData(
        patientData.filter((p) => p.PatientID !== selectedPatient.PatientID)
      );
      setFilteredPatientData(
        filteredPatientData.filter(
          (p) => p.PatientID !== selectedPatient.PatientID
        )
      );
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = patientData.filter((patient) => {
      const fullName = `${patient.FirstName} ${patient.LastName}`.toLowerCase();
      const patientID = patient.PatientID.toString().toLowerCase();
      return fullName.includes(query) || patientID.includes(query);
    });

    setFilteredPatientData(filteredData);
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch("http://localhost:4000/patients");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPatientData(data);
        setFilteredPatientData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  const sortedPatientData = [...filteredPatientData].sort((a, b) => {
    if (!sortField) return 0;
    if (sortOrder === "asc") {
      return a[sortField].localeCompare(b[sortField]);
    } else if (sortOrder === "desc") {
      return b[sortField].localeCompare(a[sortField]);
    }
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <div className="relative w-full mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="bg-white border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          placeholder="Search by Patient ID or Full Name"
        />
        <FaSearch className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-500" />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Patient ID</th>
            <th
              className="py-3 px-6 text-left cursor-pointer text-teal-600"
              onClick={() => handleSort("FirstName")}
            >
              First Name{" "}
              {sortField === "FirstName"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : "▲▼"}
            </th>
            <th
              className="py-3 px-6 text-left cursor-pointer text-teal-600"
              onClick={() => handleSort("LastName")}
            >
              Last Name{" "}
              {sortField === "LastName"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : "▲▼"}
            </th>
            <th className="py-3 px-6 text-left">Gender</th>
            <th className="py-3 px-6 text-left">Date of Birth</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Address</th>
            {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm font-light">
          {sortedPatientData.map((patient) => (
            <tr
              key={patient.PatientID}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {patient.PatientID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {patient.FirstName}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {patient.LastName}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {patient.Gender}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {new Date(patient.DateOfBirth).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {patient.Email}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {patient.Address}
              </td>
              {isAdmin && (
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <DropDownMenu
                    onUpdateInfo={() => handleUpdateInfo(patient)}
                    onDelete={() => handleDeletePatient(patient)}
                    onAddImage={() => handleAddImage(patient)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showUpdateModal && selectedPatient && (
        <UpdatePatientInformationModal
          patient={selectedPatient}
          closeModal={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
      {showDeleteModal && selectedPatient && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showAddImageModal && selectedPatient && (
        <AddDiagnosticImageModal
          patient={selectedPatient}
          closeModal={() => setShowAddImageModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PatientTable;
