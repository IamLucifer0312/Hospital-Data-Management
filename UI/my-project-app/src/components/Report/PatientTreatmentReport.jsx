import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const PatientTreatmentReport = () => {
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchAllTreatments = async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:4000/reports/treatment-report/?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch treatments.");
        }

        const data = await response.json();
        setTreatmentHistory(data);
        setFilteredHistory(data);
      } catch (err) {
        console.error("Error fetching treatments:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTreatments();
  }, [startDate, endDate]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = treatmentHistory.filter((treatment) => {
      const patientName = `${treatment.PatientName}`.toLowerCase();
      const doctorName = `${treatment.DoctorName}`.toLowerCase();
      return patientName.includes(query) || doctorName.includes(query);
    });

    setFilteredHistory(filteredData);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (!sortField) return 0;
    if (sortOrder === "asc") {
      return a[sortField].toString().localeCompare(b[sortField].toString());
    } else if (sortOrder === "desc") {
      return b[sortField].toString().localeCompare(a[sortField].toString());
    }
    return 0;
  });

  return (
    <div className="container mx-auto">
      <div className="flex space-x-10 mb-4">
        <div>
          <label className="block mb-4 text-2xl">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2"
          />
        </div>
        <div>
          <label className="block mb-4 text-2xl">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2"
          />
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="bg-white border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          placeholder="Search by Patient or Doctor's Name"
        />
        <FaSearch className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-500" />
      </div>

      {sortedHistory.length > 0 && !loading ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Treatment ID</th>
              <th
                className="py-3 px-4 text-left cursor-pointer text-teal-600"
                onClick={() => handleSort("PatientName")}
              >
                Patient{" "}
                {sortField === "PatientName"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : "▲▼"}
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer text-teal-600"
                onClick={() => handleSort("DoctorName")}
              >
                Doctor{" "}
                {sortField === "DoctorName"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : "▲▼"}
              </th>
              <th className="py-3 px-4 text-left">Details</th>
              <th className="py-3 px-4 text-left">Billing Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sortedHistory.map((treatment) => (
              <tr
                key={treatment.TreatmentID}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-4 text-left whitespace-nowrap">
                  {treatment.TreatmentID}
                </td>
                <td className="py-3 px-4 text-left whitespace-nowrap">
                  {treatment.PatientName}
                </td>
                <td className="py-3 px-4 text-left whitespace-nowrap">
                  {treatment.DoctorName}
                </td>
                <td className="py-3 px-4 text-left whitespace-nowrap">
                  {treatment.Details}
                </td>
                <td className="py-3 px-4 text-left whitespace-nowrap">
                  ${treatment.Billing.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-left whitespace-nowrap">
                  {treatment.Status}
                </td>
                <td className="py-3 px-4 text-left whitespace-nowrap">
                  {formatDate(treatment.StartDate)} -{" "}
                  {formatDate(treatment.EndDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && (
          <p className="font-semibold text-red-500">
            No treatment history found for the selected date range.
          </p>
        )
      )}
    </div>
  );
};

export default PatientTreatmentReport;
