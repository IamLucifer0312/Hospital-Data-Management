import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const DoctorPerformanceReport = () => {
  const [performanceReport, setPerformanceReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    const fetchPerformanceReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "http://localhost:4000/reports/doctor-performances"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch doctor performance report.");
        }

        const data = await response.json();
        setPerformanceReport(data);
        setFilteredReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceReport();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = performanceReport.filter((doctor) => {
      const doctorName = `${doctor.DoctorName}`.toLowerCase();
      return (
        doctorName.includes(query) || doctor.StaffID.toString().includes(query)
      );
    });

    setFilteredReport(filteredData);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const sortedReport = [...filteredReport].sort((a, b) => {
    if (!sortField) return 0;
    if (sortOrder === "asc") {
      return a[sortField] - b[sortField];
    } else if (sortOrder === "desc") {
      return b[sortField] - a[sortField];
    }
    return 0;
  });

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
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="relative w-full mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="bg-white border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          placeholder="Search by Doctor Name or Staff ID"
        />
        <FaSearch className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-500" />
      </div>

      {sortedReport.length > 0 && !loading ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Staff ID</th>
              <th className="py-3 px-6 text-left">Doctor Name</th>
              <th className="py-3 px-6 text-left">Job Type</th>
              <th className="py-3 px-6 text-left">Qualification</th>
              <th
                className="py-3 px-6 text-left cursor-pointer text-teal-600"
                onClick={() => handleSort("TotalTreatments")}
              >
                Total Treatments{" "}
                {sortField === "TotalTreatments"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : "▲▼"}
              </th>
              <th
                className="py-3 px-6 text-left cursor-pointer text-teal-600"
                onClick={() => handleSort("AverageSatisfactionScore")}
              >
                Average Satisfaction Score{" "}
                {sortField === "AverageSatisfactionScore"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : "▲▼"}
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm font-light">
            {sortedReport.map((doctor) => (
              <tr
                key={doctor.StaffID}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {doctor.StaffID}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {doctor.DoctorName}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {doctor.JobType}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {doctor.Qualification}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {doctor.TotalTreatments}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {doctor.AverageSatisfactionScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No data available.</p>
      )}
    </div>
  );
};

export default DoctorPerformanceReport;
