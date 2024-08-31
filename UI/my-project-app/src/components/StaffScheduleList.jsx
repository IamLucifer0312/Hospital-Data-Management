import React, { useState, useEffect } from "react";
import UpdateStaffScheduleModal from "./UpdateStaffScheduleModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const StaffScheduleList = ({ staffID }) => {
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleID, setSelectedScheduleID] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/staff/${staffID}/schedules`
        );
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      }
    };

    fetchSchedules();
  }, [staffID]);

  const handleUpdateClick = (scheduleID) => {
    setSelectedScheduleID(scheduleID);
    setIsAddingNew(false);
    setShowUpdateModal(true);
  };

  const handleAddNewClick = () => {
    setSelectedScheduleID(null); // No existing schedule selected
    setIsAddingNew(true);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (scheduleID) => {
    setSelectedScheduleID(scheduleID);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(
        `http://localhost:4000/staff/${staffID}/schedules/${selectedScheduleID}`,
        {
          method: "DELETE",
        }
      );
      setSchedules((prevSchedules) =>
        prevSchedules.filter(
          (schedule) => schedule.ScheduleID !== selectedScheduleID
        )
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  const handleUpdateSuccess = (updatedSchedule) => {
    if (isAddingNew) {
      setSchedules([...schedules, updatedSchedule]);
    } else {
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) =>
          schedule.ScheduleID === updatedSchedule.ScheduleID
            ? updatedSchedule
            : schedule
        )
      );
    }
    setShowUpdateModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      {schedules.length === 0 ? (
        <p className="text-gray-500 text-center">No schedule available</p>
      ) : (
        schedules.map((schedule) => (
          <div key={schedule.ScheduleID} className="border-b py-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {schedule.DayOfWeek}
            </h3>
            <p className="text-gray-600">
              {schedule.StartTime} - {schedule.EndTime}
            </p>
            <div className="mt-2 flex space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleUpdateClick(schedule.ScheduleID)}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleDeleteClick(schedule.ScheduleID)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      <div className="mt-4 flex justify-center">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddNewClick}
        >
          Add New Schedule
        </button>
      </div>

      {showUpdateModal && (
        <UpdateStaffScheduleModal
          staffID={staffID}
          scheduleID={selectedScheduleID}
          closeModal={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateSuccess}
          isAddingNew={isAddingNew}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default StaffScheduleList;
