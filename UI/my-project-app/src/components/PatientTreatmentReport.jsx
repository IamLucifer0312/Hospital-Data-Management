import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const PatientTreatmentReport = () => {
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(false); // Ensure it's false initially
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      return patientName.includes(query);
    });

    setFilteredHistory(filteredData);
  };

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
          className="border p-2 w-full"
          placeholder="Search by Patient Name"
        />
        <FaSearch className="absolute top-3 right-3 text-gray-500" />
      </div>

      {filteredHistory.length > 0 && !loading ? (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Treatment ID</th>
              <th className="border p-2">Patient</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Details</th>
              <th className="border p-2">Billing Amount</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((treatment) => (
              <tr key={treatment.TreatmentID}>
                <td className="border p-2">{treatment.TreatmentID}</td>
                <td className="border p-2">{treatment.PatientName}</td>
                <td className="border p-2">{treatment.DoctorName}</td>
                <td className="border p-2">{treatment.Details}</td>
                <td className="border p-2">{treatment.Billing}</td>
                <td className="border p-2">{treatment.Status}</td>
                <td className="border p-2">
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
