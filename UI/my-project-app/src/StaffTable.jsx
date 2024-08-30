import React, { useState, useEffect } from "react";

const StaffTable = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchStaffData = async () => {
      try {
        const response = await fetch("http://localhost:3000/staff");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStaffData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchStaffData();
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Staff ID</th>
            <th className="py-3 px-6 text-left">First Name</th>
            <th className="py-3 px-6 text-left">Last Name</th>
            <th className="py-3 px-6 text-left">Job Type</th>
            <th className="py-3 px-6 text-left">Salary</th>
            <th className="py-3 px-6 text-left">Qualification</th>
            <th className="py-3 px-6 text-left">Department ID</th>
            <th className="py-3 px-6 text-left">Manager ID</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {staffData.map((staff) => (
            <tr
              key={staff.StaffID}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {staff.StaffID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {staff.FirstName}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {staff.LastName}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {staff.JobType}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                ${staff.Salary.toLocaleString()}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {staff.Qualification}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {staff.DepartmentID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {staff.ManagerID || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
