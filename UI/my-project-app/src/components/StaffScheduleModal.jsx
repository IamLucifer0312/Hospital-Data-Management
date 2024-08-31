import React from "react";
import StaffScheduleList from "./StaffScheduleList";

const StaffScheduleModal = ({ staffID, closeModal }) => {
  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Working Schedule</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>
        <div className="p-6">
          <StaffScheduleList staffID={staffID} />
        </div>
      </div>
    </div>
  );
};
export default StaffScheduleModal;
