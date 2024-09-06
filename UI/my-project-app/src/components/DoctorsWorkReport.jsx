import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const DoctorsWorkReport = () => {
  const [doctorsWork, setDoctorsWork] = useState([]);
  const [filteredWork, setFilteredWork] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchDoctorsWork = async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:4000/reports/all-doctors-work?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch doctors' work.");
        }

        const data = await response.json();
        setDoctorsWork(data);
        setFilteredWork(data);
      } catch (err) {
        console.error("Error fetching doctors' work:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsWork();
  }, [startDate, endDate]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = doctorsWork.filter((work) => {
      const doctorName =
        `${work.DoctorFirstName} ${work.DoctorLastName}`.toLowerCase();
      return doctorName.includes(query);
    });

    setFilteredWork(filteredData);
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
          placeholder="Search by Doctor Name"
        />
        <FaSearch className="absolute top-3 right-3 text-gray-500" />
      </div>

      {filteredWork.length > 0 && !loading ? (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Treatment ID</th>
              <th className="border p-2">Doctor</th>
              <th className="border p-2">Patient</th>
              <th className="border p-2">Details</th>
              <th className="border p-2">Billing Amount</th>
              <th className="border p-2">Treatment Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredWork.map((work) => (
              <tr key={work.TreatmentID}>
                <td className="border p-2">{work.TreatmentID}</td>
                <td className="border p-2">
                  {work.DoctorFirstName} {work.DoctorLastName}
                </td>
                <td className="border p-2">
                  {work.PatientFirstName} {work.PatientLastName}
                </td>
                <td className="border p-2">{work.TreatmentDescription}</td>
                <td className="border p-2">{work.BillingAmount}</td>
                <td className="border p-2">{formatDate(work.TreatmentDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && (
          <p className="font-semibold text-red-500">
            No doctor work history found for the selected date range.
          </p>
        )
      )}
    </div>
  );
};

export default DoctorsWorkReport;
