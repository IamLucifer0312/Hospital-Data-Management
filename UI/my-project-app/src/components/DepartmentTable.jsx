import React, { useState, useEffect } from "react";

const DepartmentTable = () => {
  const departments = [
    { id: 1, name: "Cardiology" },
    { id: 2, name: "Neurology" },
    { id: 3, name: "Pediatrics" },
    { id: 4, name: "Oncology" },
    { id: 5, name: "Orthopedics" },
  ];

  const [activeDepartment, setActiveDepartment] = useState(departments[0].id);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffByDepartment = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/staffs/department/${activeDepartment}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStaff(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchStaffByDepartment();
  }, [activeDepartment]);

  const handleTabClick = (departmentId) => {
    setActiveDepartment(departmentId);
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-around mb-4">
        {departments.map((department) => (
          <button
            key={department.id}
            onClick={() => handleTabClick(department.id)}
            className={`px-4 py-2 rounded-md uppercase text-pretty ${
              activeDepartment === department.id
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            } transition-all duration-300`}
          >
            {department.name}
          </button>
        ))}
      </div>

      <div className="w-full">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : staff.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left border-b border-gray-300">
                  ID
                </th>
                <th className="py-3 px-6 text-left border-b border-gray-300">
                  First Name
                </th>
                <th className="py-3 px-6 text-left border-b border-gray-300">
                  Last Name
                </th>
                <th className="py-3 px-6 text-left border-b border-gray-300">
                  Job Type
                </th>
                <th className="py-3 px-6 text-left border-b border-gray-300">
                  Department ID
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {staff.map((staffMember) => (
                <tr
                  key={staffMember.StaffID}
                  className="border-b border-gray-300 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                    {staffMember.StaffID}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                    {staffMember.FirstName}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                    {staffMember.LastName}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                    {staffMember.JobType}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                    {staffMember.DepartmentID}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No staff found for this department.</div>
        )}
      </div>
    </div>
  );
};

export default DepartmentTable;
