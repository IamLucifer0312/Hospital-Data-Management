import React, { useState, useEffect } from "react";
import AppointmentDropDownMenu from "./AppointmentDropDownMenu";
import NotesModal from "./NotesModal";
import AddNoteModal from "./AddNoteModal";
import UpdateAppointmentModal from "./UpdateAppointmentModal"; // New import
import { FaSearch } from "react-icons/fa";

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showUpdateAppointmentModal, setShowUpdateAppointmentModal] =
    useState(false); // New state
  const [message, setMessage] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:4000/appointments");
        if (!response.ok) {
          throw new Error("Failed to fetch appointments.");
        }
        const data = await response.json();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredData = appointments.filter((appointment) => {
      const patientName =
        `${appointment.PatientFirstName} ${appointment.PatientLastName}`.toLowerCase();
      const doctorName =
        `${appointment.DoctorFirstName} ${appointment.DoctorLastName}`.toLowerCase();
      return patientName.includes(query) || doctorName.includes(query);
    });

    setFilteredAppointments(filteredData);
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleViewNotes = (appointment) => {
    if (appointment.StaffID && appointment.PatientID) {
      setSelectedAppointment(appointment);
      setShowNotesModal(true);
    } else {
      console.error(
        "Staff ID or Patient ID is missing in the selected appointment."
      );
    }
  };

  const handleAddNote = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAddNoteModal(true);
  };

  const handleUpdateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowUpdateAppointmentModal(true); // Show the update modal
  };

  const confirmCancelAppointment = async (appointment) => {
    if (appointment.AppointmentStatus === "Cancelled") {
      setMessage("This appointment is already canceled.");
      setTimeout(() => {
        setMessage("");
        setShowCancelModal(false);
      }, 2000);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/appointments/${selectedAppointment.AppointmentID}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AppointmentStatus: "Cancelled",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment.");
      }

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.AppointmentID === selectedAppointment.AppointmentID
            ? { ...appointment, AppointmentStatus: "Cancelled" }
            : appointment
        )
      );
      setMessage("Appointment successfully canceled.");
      setTimeout(() => {
        setMessage("");
        setShowCancelModal(false);
      }, 2000);
    } catch (err) {
      console.error("Error canceling appointment:", err);
      setMessage("Failed to cancel appointment.");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortField) return 0;
    if (sortOrder === "asc") {
      return a[sortField].localeCompare(b[sortField]);
    } else if (sortOrder === "desc") {
      return b[sortField].localeCompare(a[sortField]);
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
          placeholder="Search by Patient or Doctor Name"
        />
        <FaSearch className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-500" />
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-4 text-left w-1/12">ID</th>
            <th className="py-3 px-4 text-left w-1/12">Date</th>
            <th className="py-3 px-4 text-left w-1/12">Start Time</th>
            <th className="py-3 px-4 text-left w-1/12">End Time</th>
            <th className="py-3 px-4 text-left w-1/12">Status</th>
            <th className="py-3 px-4 text-left w-3/12">Purpose</th>
            <th className="py-3 px-4 text-left w-2/12">Patient</th>
            <th className="py-3 px-4 text-left w-2/12">Doctor</th>
            <th className="py-3 px-4 text-center w-1/12">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedAppointments.map((appointment) => (
            <tr
              key={appointment.AppointmentID}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-3 text-left whitespace-nowrap">
                {appointment.AppointmentID}
              </td>
              <td className="py-3 px-3 text-left whitespace-nowrap">
                {appointment.AppointmentDate}
              </td>
              <td className="py-3 px-3 text-left whitespace-nowrap">
                {appointment.AppointmentStartTime}
              </td>
              <td className="py-3 px-3 text-left whitespace-nowrap">
                {appointment.AppointmentEndTime}
              </td>
              <td className="py-3 px-3 text-left whitespace-nowrap">
                {appointment.AppointmentStatus}
              </td>
              <td className="py-3 px-3 text-left whitespace-nowrap">
                {appointment.Purpose}
              </td>
              <td className="py-3 px-3 text-left whitespace-nowrap">
                {`${appointment.PatientFirstName} ${appointment.PatientLastName}`}
                <br />
                <span className="text-sm text-gray-500">
                  {appointment.PatientPhoneNum}
                </span>
              </td>
              <td className="py-3 px-3 text-left whitespace-nowrap">
                {`${appointment.DoctorFirstName} ${appointment.DoctorLastName}`}
                <br />
                <span className="text-sm text-gray-500">
                  {appointment.DoctorQualification}
                </span>
              </td>
              <td className="py-3 px-3 text-center whitespace-nowrap">
                <AppointmentDropDownMenu
                  onCancel={() => handleCancelAppointment(appointment)}
                  onViewNotes={() => handleViewNotes(appointment)}
                  onAddNote={() => handleAddNote(appointment)}
                  onUpdateAppointment={() =>
                    handleUpdateAppointment(appointment)
                  } // Add this line
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">Confirm Cancellation</h2>
            <p>
              Are you sure you want to cancel the appointment with ID:{" "}
              {selectedAppointment?.AppointmentID}?
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => confirmCancelAppointment(selectedAppointment)}
              >
                Cancel Appointment
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowCancelModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotesModal && (
        <NotesModal
          appointmentID={selectedAppointment.AppointmentID}
          staffID={selectedAppointment.StaffID}
          patientID={selectedAppointment.PatientID}
          closeModal={() => setShowNotesModal(false)}
        />
      )}

      {showAddNoteModal && (
        <AddNoteModal
          closeModal={() => setShowAddNoteModal(false)}
          onAddNote={(newNote) => console.log("New note added:", newNote)}
          initialStaff={selectedAppointment?.StaffID}
          initialPatient={selectedAppointment?.PatientID}
          initialAppointment={selectedAppointment?.AppointmentID}
        />
      )}

      {showUpdateAppointmentModal && (
        <UpdateAppointmentModal
          closeModal={() => setShowUpdateAppointmentModal(false)}
          initialAppointment={selectedAppointment}
          onUpdate={(updatedAppointment) =>
            console.log("Appointment updated:", updatedAppointment)
          }
        />
      )}

      {message && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-5">
          {message}
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
