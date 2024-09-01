import React, { useState, useEffect } from "react";
import Select from "react-select";

const BookAppointment = () => {
  const [doctorId, setDoctorId] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:4000/staffs");
        const data = await response.json();
        const filteredDoctors = data.filter(
          (staff) => staff.JobType === "Doctor"
        );
        setDoctors(
          filteredDoctors.map((doctor) => ({
            value: doctor.StaffID,
            label: `${doctor.FirstName} ${doctor.LastName} - ${doctor.Qualification} - ID: ${doctor.StaffID}`,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };

    // Fetch all patients
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:4000/patients");
        const data = await response.json();
        setPatients(
          data.map((patient) => ({
            value: patient.PatientID,
            label: `${patient.FirstName} ${patient.LastName} - ${patient.PhoneNum} - ID: ${patient.PatientID}`,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch patients", err);
      }
    };

    fetchDoctors();
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultMessage("");

    try {
      const response = await fetch("http://localhost:4000/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentDate: appointmentDate,
          appointmentStartTime: startTime,
          appointmentEndTime: endTime,
          appointmentStatus: "Scheduled",
          purpose: purpose,
          patientID: patientId?.value,
          staffID: doctorId?.value,
        }),
      });

      const data = await response.json();
      setResultMessage(data.message || "Appointment booked successfully!");
    } catch (err) {
      setResultMessage(
        err.message || "Failed to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-teal-500 text-center">
        Book an Appointment
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Doctor</label>
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
          <label className="block text-gray-700 font-bold mb-2">Patient</label>
          <Select
            value={patientId}
            onChange={setPatientId}
            options={patients}
            isSearchable
            placeholder="Select a Patient"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Appointment Date
          </label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Purpose</label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
      {resultMessage && (
        <p className="mt-4 text-center text-teal-600">{resultMessage}</p>
      )}
    </div>
  );
};

export default BookAppointment;
