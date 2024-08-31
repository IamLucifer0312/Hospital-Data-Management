import React, { useState, useEffect } from "react";

const UpdateStaffScheduleModal = ({
  staffID,
  scheduleID,
  closeModal,
  onUpdate,
  isAddingNew,
}) => {
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isAddingNew && scheduleID) {
      const fetchScheduleDetails = async () => {
        try {
          const response = await fetch(
            `http://localhost:4000/staff/${staffID}/schedules/${scheduleID}`
          );
          const schedule = await response.json();
          setDayOfWeek(schedule.dayOfWeek || "");
          setStartTime(schedule.startTime || "");
          setEndTime(schedule.endTime || "");
        } catch (err) {
          setErrorMessage("Failed to load schedule details");
        }
      };
      fetchScheduleDetails();
    }
  }, [staffID, scheduleID, isAddingNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isAddingNew
      ? `http://localhost:4000/staff/${staffID}/schedules`
      : `http://localhost:4000/staff/${staffID}/schedules/${scheduleID}`;

    const method = isAddingNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dayOfWeek, startTime, endTime }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save schedule");
      }

      const updatedSchedule = await response.json();
      onUpdate(updatedSchedule);
      setSuccessMessage("Schedule saved successfully!");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-teal-500">
          {isAddingNew ? "Add New Schedule" : "Update Schedule"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Day of Week
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 mb-4 text-center">{successMessage}</p>
          )}

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isAddingNew ? "Add Schedule" : "Update Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStaffScheduleModal;
