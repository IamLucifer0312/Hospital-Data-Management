import React, { useState, useEffect } from "react";
import Select from "react-select";

const AddNoteModal = ({ closeModal, onAddNote }) => {
  const [staffOptions, setStaffOptions] = useState([]);
  const [patientOptions, setPatientOptions] = useState([]);
  const [appointmentOptions, setAppointmentOptions] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [staffResponse, patientResponse, appointmentResponse] =
          await Promise.all([
            fetch("http://localhost:4000/staffs"),
            fetch("http://localhost:4000/patients"),
            fetch("http://localhost:4000/appointments"),
          ]);

        if (
          !staffResponse.ok ||
          !patientResponse.ok ||
          !appointmentResponse.ok
        ) {
          throw new Error("Failed to fetch options");
        }

        const staffData = await staffResponse.json();
        const patientData = await patientResponse.json();
        const appointmentData = await appointmentResponse.json();

        setStaffOptions(
          staffData.map((staff) => ({
            value: staff.StaffID,
            label:
              staff.FirstName +
              " " +
              staff.LastName +
              " - " +
              "ID: " +
              staff.StaffID +
              " - " +
              "Job: " +
              staff.JobType,
          }))
        );
        setPatientOptions(
          patientData.map((patient) => ({
            value: patient.PatientID,
            label:
              patient.FirstName +
              " " +
              patient.LastName +
              " - " +
              "ID: " +
              patient.PatientID,
          }))
        );
        setAppointmentOptions(
          appointmentData.map((appointment) => ({
            value: appointment.AppointmentID,
            label: `Appointment ${appointment.AppointmentID} - ${appointment.AppointmentDate} - ${appointment.AppointmentStatus}`,
          }))
        );

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaff || !selectedPatient || !selectedAppointment || !note) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          StaffID: selectedStaff.value,
          PatientID: selectedPatient.value,
          AppointmentID: selectedAppointment.value,
          Note: note,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      const newNote = await response.json();
      onAddNote(newNote);
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
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
        <h2 className="text-2xl font-bold mb-6 text-teal-500">Add New Note</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Staff
            </label>
            <Select
              options={staffOptions}
              onChange={setSelectedStaff}
              value={selectedStaff}
              placeholder="Select Staff"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Patient
            </label>
            <Select
              options={patientOptions}
              onChange={setSelectedPatient}
              value={selectedPatient}
              placeholder="Select Patient"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Appointment
            </label>
            <Select
              options={appointmentOptions}
              onChange={setSelectedAppointment}
              value={selectedAppointment}
              placeholder="Select Appointment"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter note"
              required
            ></textarea>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;
