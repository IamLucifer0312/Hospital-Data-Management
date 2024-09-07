import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const DoctorWorkReport = () => {
  const [workReport, setWorkReport] = useState([]);
  const [filteredWorkReport, setFilteredWorkReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    const fetchWorkReport = async () => {
      if (!startDate || !endDate) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:4000/reports/all-doctors-work-given-duration?startDate=${startDate}&endDate=${endDate}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch work report.");
        }

        const data = await response.json();
        setWorkReport(data);
        setFilteredWorkReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkReport();
  }, [startDate, endDate]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = workReport.filter((work) => {
      const staffName = `${work.StaffName}`.toLowerCase();
      return (
        staffName.includes(query) || work.StaffID.toString().includes(query)
      );
    });

    setFilteredWorkReport(filteredData);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const sortedWorkReport = [...filteredWorkReport].sort((a, b) => {
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
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="border p-2 w-full"
          placeholder="Search by Staff ID or Staff Name"
        />
        <FaSearch className="absolute top-3 right-3 text-gray-500" />
      </div>

      {sortedWorkReport.length > 0 && !loading ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-lg leading-normal">
              <th className="py-3 px-6 text-left w-2/12">Staff ID</th>
              <th className="py-3 px-6 text-left w-4/12">Staff Name</th>
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
                onClick={() => handleSort("TotalScheduledWorkHours")}
              >
                Total Scheduled Work Hours{" "}
                {sortField === "TotalScheduledWorkHours"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : "▲▼"}
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm font-light">
            {sortedWorkReport.map((work) => (
              <tr
                key={work.StaffID}
                className="border-b border-gray-200 hover:bg-gray-100 text-md"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {work.StaffID}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {work.StaffName}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {work.TotalTreatments}
                </td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {work.TotalScheduledWorkHours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && (
          <p className="font-semibold text-red-500">
            No data available for the selected duration.
          </p>
        )
      )}
    </div>
  );
};

export default DoctorWorkReport;
