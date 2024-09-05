import React, { useState, useEffect } from "react";
import DropDownMenu from "./DropDownMenu";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { FaSearch } from "react-icons/fa";

const TreatmentHistoryTable = () => {
  const [treatmentData, setTreatmentData] = useState([]);
  const [filteredTreatmentData, setFilteredTreatmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const handleDeleteTreatment = (treatment) => {
    setSelectedTreatment(treatment);
    setShowDeleteModal(true);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const handleUpdateSuccess = (updatedTreatment) => {
    setTreatmentData((prevData) =>
      prevData.map((treatment) =>
        treatment.TreatmentID === updatedTreatment.TreatmentID
          ? updatedTreatment
          : treatment
      )
    );
    setFilteredTreatmentData((prevData) =>
      prevData.map((treatment) =>
        treatment.TreatmentID === updatedTreatment.TreatmentID
          ? updatedTreatment
          : treatment
      )
    );
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/treatmentHistories/${selectedTreatment.TreatmentID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete treatment.");
      }
      setTreatmentData(
        treatmentData.filter(
          (t) => t.TreatmentID !== selectedTreatment.TreatmentID
        )
      );
      setFilteredTreatmentData(
        filteredTreatmentData.filter(
          (t) => t.TreatmentID !== selectedTreatment.TreatmentID
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

    const filteredData = treatmentData.filter((treatment) => {
      const treatmentType = treatment.TreatmentType.toLowerCase();
      const patientID = treatment.PatientID.toString().toLowerCase();
      return treatmentType.includes(query) || patientID.includes(query);
    });

    setFilteredTreatmentData(filteredData);
  };

  useEffect(() => {
    const fetchTreatmentData = async () => {
      try {
        const response = await fetch("http://localhost:4000/treatments");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTreatmentData(data);
        setFilteredTreatmentData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchTreatmentData();
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

  const sortedTreatmentData = [...filteredTreatmentData].sort((a, b) => {
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
          placeholder="Search by Treatment Type or Patient ID"
        />
        <FaSearch className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-500" />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Treatment ID</th>
            <th className="py-3 px-6 text-left">Patient ID</th>
            <th className="py-3 px-6 text-left">Doctor ID</th>
            <th
              className="py-3 px-6 text-left cursor-pointer text-teal-600"
              onClick={() => handleSort("StartDate")}
            >
              Start Date{" "}
              {sortField === "StartDate"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : "▲▼"}
            </th>
            <th className="py-3 px-6 text-left">End Date</th>
            <th className="py-3 px-6 text-left">Treatment Type</th>
            <th className="py-3 px-6 text-left">Billing Amount</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Details</th>
            {isAdmin && <th className="py-3 px-6 text-center">Actions</th>}
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm font-light">
          {sortedTreatmentData.map((treatment) => (
            <tr
              key={treatment.TreatmentID}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {treatment.TreatmentID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {treatment.PatientID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {treatment.DoctorID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {new Date(treatment.StartDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {new Date(treatment.EndDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {treatment.TreatmentType}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                ${treatment.BillingAmount.toLocaleString()}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {treatment.Status}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {treatment.Details}
              </td>
              {isAdmin && (
                <td className="py-3 px-6 text-center whitespace-nowrap">
                  <DropDownMenu
                    onDelete={() => handleDeleteTreatment(treatment)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteModal && selectedTreatment && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default TreatmentHistoryTable;
