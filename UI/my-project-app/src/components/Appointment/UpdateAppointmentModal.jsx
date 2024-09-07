import React, { useState, useEffect } from "react";
import Select from "react-select";

const UpdateAppointmentModal = ({
  closeModal,
  initialAppointment,
  onUpdate,
}) => {
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(initialAppointment.AppointmentDate).toISOString().split("T")[0]
  );
  const [appointmentStartTime, setAppointmentStartTime] = useState(
    initialAppointment.AppointmentStartTime
  );
  const [appointmentEndTime, setAppointmentEndTime] = useState(
    initialAppointment.AppointmentEndTime
  );
  const [appointmentStatus, setAppointmentStatus] = useState(
    initialAppointment.AppointmentStatus
  );
  const [purpose, setPurpose] = useState(initialAppointment.Purpose);
  const [doctorId, setDoctorId] = useState({
    value: initialAppointment.StaffID,
    label: initialAppointment.StaffName,
  });
  const [patientId, setPatientId] = useState({
    value: initialAppointment.PatientID,
    label: initialAppointment.PatientName,
  });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes] = await Promise.all([
          fetch("http://localhost:4000/staffs"),
          fetch("http://localhost:4000/patients"),
        ]);

        const doctorsData = await doctorsRes.json();
        const patientsData = await patientsRes.json();

        const doctorOptions = doctorsData.map((doctor) => ({
          value: doctor.StaffID,
          label: `${doctor.FirstName} ${doctor.LastName} - ${doctor.Qualification} - ID: ${doctor.StaffID}`,
        }));

        const patientOptions = patientsData.map((patient) => ({
          value: patient.PatientID,
          label: `${patient.FirstName} ${patient.LastName} - ${patient.PhoneNum}`,
        }));

        setDoctors(doctorOptions);
        setPatients(patientOptions);

        // Set initial selected values after options are available
        setDoctorId(
          doctorOptions.find(
            (option) => option.value === initialAppointment.StaffID
          )
        );
        setPatientId(
          patientOptions.find(
            (option) => option.value === initialAppointment.PatientID
          )
        );
      } catch (err) {
        setError("Failed to fetch doctors or patients.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedAppointment = {
        appointmentDate,
        appointmentStartTime,
        appointmentEndTime,
        appointmentStatus,
        purpose,
        patientID: patientId.value,
        staffID: doctorId.value,
      };
      await fetch(
        `http://localhost:4000/appointments/${initialAppointment.AppointmentID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAppointment),
        }
      );
      onUpdate(updatedAppointment);
      closeModal();
    } catch (err) {
      setError("Failed to update appointment");
    }
  };

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
        <h2 className="text-2xl font-bold mb-6 text-teal-500 text-center uppercase">
          Update Appointment
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={appointmentStartTime}
              onChange={(e) => setAppointmentStartTime(e.target.value)}
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
              value={appointmentEndTime}
              onChange={(e) => setAppointmentEndTime(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <input
              type="text"
              value={appointmentStatus}
              onChange={(e) => setAppointmentStatus(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Doctor
            </label>
            <Select
              value={doctorId}
              onChange={setDoctorId}
              options={doctors}
              isSearchable
              placeholder="Select a Doctor"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Patient
            </label>
            <Select
              value={patientId}
              onChange={setPatientId}
              options={patients}
              isSearchable
              placeholder="Select a Patient"
              className="w-full"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAppointmentModal;
