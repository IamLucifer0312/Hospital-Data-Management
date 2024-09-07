import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const JobChangeHistory = () => {
  const [jobHistory, setJobHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobChangeHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/reports/job-change-history`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch job change history.");
        }
        const data = await response.json();
        setJobHistory(data);
        setFilteredHistory(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobChangeHistory();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = jobHistory.filter((change) => {
      const staffName = `${change.FirstName} ${change.LastName}`.toLowerCase();
      const oldDepartmentName = change.OldDepartmentName.toLowerCase();
      const newDepartmentName = change.NewDepartmentName.toLowerCase();
      const oldJobType = change.OldJobType.toLowerCase();
      const newJobType = change.NewJobType.toLowerCase();
      return (
        staffName.includes(query) ||
        oldDepartmentName.includes(query) ||
        newDepartmentName.includes(query) ||
        oldJobType.includes(query) ||
        newJobType.includes(query)
      );
    });

    setFilteredHistory(filteredData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="border p-2 w-full"
          placeholder="Search by Staff Name, Job Type, or Department"
        />
        <FaSearch className="absolute top-3 right-3 text-gray-500" />
      </div>

      {filteredHistory.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Change Date</th>
              <th className="py-3 px-4 text-left">Staff Name</th>
              <th className="py-3 px-4 text-left">Old Job Type</th>
              <th className="py-3 px-4 text-left">New Job Type</th>
              <th className="py-3 px-4 text-left">Old Salary</th>
              <th className="py-3 px-4 text-left">New Salary</th>
              <th className="py-3 px-4 text-left">Old Department</th>
              <th className="py-3 px-4 text-left">New Department</th>
              <th className="py-3 px-4 text-left">Reason</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredHistory.map((change) => (
              <tr
                key={change.ChangeID}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-4">
                  {new Date(change.ChangeDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {change.FirstName} {change.LastName}
                </td>
                <td className="py-3 px-4">{change.OldJobType}</td>
                <td className="py-3 px-4">{change.NewJobType}</td>
                <td className="py-3 px-4">
                  ${change.OldSalary?.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  ${change.NewSalary?.toLocaleString()}
                </td>
                <td className="py-3 px-4">{change.OldDepartmentName}</td>
                <td className="py-3 px-4">{change.NewDepartmentName}</td>
                <td className="py-3 px-4">{change.Reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No job change history matches your search.</p>
      )}
    </div>
  );
};

export default JobChangeHistory;
