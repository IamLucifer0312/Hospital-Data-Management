import React, { useState, useEffect } from "react";
import UpdateStaffScheduleModal from "./UpdateStaffScheduleModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const StaffScheduleModal = ({ staffID, closeModal }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/schedules/staff/${staffID}/`
        );
        const data = await response.json();
        setSchedules(data);
      } catch (err) {
        setErrorMessage("Failed to load schedules.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [staffID]);

  const handleEditClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowUpdateModal(true);
  };

  const handleAddNewClick = () => {
    setSelectedSchedule(null);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = (updatedSchedule) => {
    if (!selectedSchedule) {
      setSchedules([...schedules, updatedSchedule]);
    } else {
      setSchedules(
        schedules.map((schedule) =>
          schedule.ScheduleID === updatedSchedule.ScheduleID
            ? updatedSchedule
            : schedule
        )
      );
    }

    setShowUpdateModal(false);
  };

  const handleDeleteClick = (scheduleID) => {
    setScheduleToDelete(scheduleID);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/schedules/${scheduleToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete schedule.");
      }

      // Update the state to remove the deleted schedule
      setSchedules(
        schedules.filter((schedule) => schedule.ScheduleID !== scheduleToDelete)
      );
      setShowDeleteModal(false); // Close the delete confirmation modal
    } catch (err) {
      setErrorMessage("Failed to delete schedule.");
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div className="text-red-500">{errorMessage}</div>;
  }

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-teal-500 text-center uppercase">
          Staff Schedules
        </h2>
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div key={schedule.ScheduleID} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-pretty">{schedule.DayOfWeek}</p>
                  <p>
                    {schedule.StartTime} - {schedule.EndTime}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleEditClick(schedule)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteClick(schedule.ScheduleID)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No schedules available.</p>
        )}

        <div className="flex justify-center">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
            onClick={handleAddNewClick}
          >
            Add New Schedule
          </button>
        </div>

        {showUpdateModal && (
          <UpdateStaffScheduleModal
            staffID={staffID}
            scheduleID={selectedSchedule ? selectedSchedule.ScheduleID : null}
            closeModal={() => setShowUpdateModal(false)}
            scheduleData={selectedSchedule}
            onUpdate={handleUpdateSuccess}
            isAddingNew={!selectedSchedule}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StaffScheduleModal;
