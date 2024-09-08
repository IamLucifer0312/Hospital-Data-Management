import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const TreatmentHistoryTable = () => {
  const [treatmentData, setTreatmentData] = useState([]);
  const [filteredTreatmentData, setFilteredTreatmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = treatmentData.filter((treatment) => {
      const treatmentType = treatment.TreatmentType.toLowerCase();
      const patientName = treatment.PatientName.toLowerCase();
      const doctorName = treatment.DoctorName.toLowerCase();
      return (
        treatmentType.includes(query) ||
        patientName.includes(query) ||
        doctorName.includes(query)
      );
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
        const treatments = await response.json();

        const patientPromises = treatments.map((treatment) =>
          fetch(`http://localhost:4000/patients/${treatment.PatientID}`).then(
            (res) => res.json()
          )
        );
        const doctorPromises = treatments.map((treatment) =>
          fetch(`http://localhost:4000/staffs/${treatment.DoctorID}`).then(
            (res) => res.json()
          )
        );

        const patients = await Promise.all(patientPromises);
        const doctors = await Promise.all(doctorPromises);

        const updatedTreatments = treatments.map((treatment, index) => ({
          ...treatment,
          PatientName: `${patients[index].FirstName} ${patients[index].LastName}`,
          DoctorName: `${doctors[index].FirstName} ${doctors[index].LastName}`,
        }));

        setTreatmentData(updatedTreatments);
        setFilteredTreatmentData(updatedTreatments);
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
          placeholder="Search by Treatment Type, Patient Name, or Doctor Name"
        />
        <FaSearch className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-500" />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Treatment ID</th>
            <th className="py-3 px-6 text-left">Patient Name</th>
            <th className="py-3 px-6 text-left">Doctor Name</th>
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
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Details</th>
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
                {treatment.PatientName}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {treatment.DoctorName}
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
                {treatment.Status}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {treatment.Details}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreatmentHistoryTable;
