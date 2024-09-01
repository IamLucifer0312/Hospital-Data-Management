import React, { useState, useEffect } from "react";
import DropDownMenu from "./DropDownMenu";
import StaffScheduleModal from "./StaffScheduleModal";
import UpdateStaffInformationModal from "./UpdateStaffInformationModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const StaffTable = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStaffID, setSelectedStaffID] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const handleViewSchedule = (staffID) => {
    setSelectedStaffID(staffID);
    setShowScheduleModal(true);
  };

  const handleUpdateInfo = (staff) => {
    setSelectedStaff(staff);
    setShowUpdateModal(true);
  };

  const handleDeleteStaff = (staff) => {
    setSelectedStaff(staff);
    setShowDeleteModal(true);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const handleUpdateSuccess = (updatedStaff) => {
    setStaffData((prevData) =>
      prevData.map((staff) =>
        staff.StaffID === updatedStaff.StaffID ? updatedStaff : staff
      )
    );
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/staffs/${selectedStaff.StaffID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete staff.");
      }
      setStaffData(
        staffData.filter((s) => s.StaffID !== selectedStaff.StaffID)
      );
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch("http://localhost:4000/staffs");
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

  const sortedStaffData = [...staffData].sort((a, b) => {
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
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Staff ID</th>
            <th
              className="py-3 px-6 text-left cursor-pointer text-teal-600"
              onClick={() => handleSort("FirstName")}
            >
              First Name{" "}
              {sortField === "FirstName"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : "▲▼"}
            </th>
            <th
              className="py-3 px-6 text-left cursor-pointer text-teal-600"
              onClick={() => handleSort("LastName")}
            >
              Last Name{" "}
              {sortField === "LastName"
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : "▲▼"}
            </th>
            <th className="py-3 px-6 text-left">Job Type</th>
            <th className="py-3 px-6 text-left">Salary</th>
            <th className="py-3 px-6 text-left">Qualification</th>
            <th className="py-3 px-6 text-left">Department ID</th>
            <th className="py-3 px-6 text-left">Manager ID</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm font-light">
          {sortedStaffData.map((staff) => (
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
              <td className="py-3 px-6 text-center whitespace-nowrap">
                <DropDownMenu
                  onViewSchedule={() => handleViewSchedule(staff.StaffID)}
                  onUpdateInfo={() => handleUpdateInfo(staff)}
                  onDelete={() => handleDeleteStaff(staff)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showScheduleModal && (
        <StaffScheduleModal
          staffID={selectedStaffID}
          closeModal={() => setShowScheduleModal(false)}
        />
      )}
      {showUpdateModal && selectedStaff && (
        <UpdateStaffInformationModal
          staff={selectedStaff}
          closeModal={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
      {showDeleteModal && selectedStaff && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default StaffTable;
