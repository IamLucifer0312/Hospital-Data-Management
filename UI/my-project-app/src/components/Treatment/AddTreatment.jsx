import React, { useState, useEffect } from "react";
import Select from "react-select";

const AddNewTreatment = () => {
  const [patientID, setPatientID] = useState(null);
  const [doctorID, setDoctorID] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [treatmentType, setTreatmentType] = useState("");
  const [billingAmount, setBillingAmount] = useState("");
  const [satisfactionScore, setSatisfactionScore] = useState(""); // New state for SatisfactionScore
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch patients and doctors when the component mounts
  useEffect(() => {
    const fetchPatientsAndDoctors = async () => {
      try {
        const [patientsResponse, doctorsResponse] = await Promise.all([
          fetch("http://localhost:4000/patients"),
          fetch("http://localhost:4000/staffs"),
        ]);

        if (!patientsResponse.ok || !doctorsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const patientsData = await patientsResponse.json();
        const doctorsData = await doctorsResponse.json();

        const filteredDoctors = doctorsData.filter(
          (doctor) => doctor.JobType === "Doctor"
        );
        setPatients(
          patientsData.map((patient) => ({
            value: patient.PatientID,
            label: `${patient.FirstName} ${patient.LastName} - ID: ${patient.PatientID} - Phone number: ${patient.PhoneNum}`,
          }))
        );
        setDoctors(
          filteredDoctors.map((doctor) => ({
            value: doctor.StaffID,
            label: `${doctor.FirstName} ${doctor.LastName} - ID: ${doctor.StaffID} - Qualification: ${doctor.Qualification}`,
          }))
        );
      } catch (err) {
        setError("Failed to fetch patients or doctors");
      }
    };

    fetchPatientsAndDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const newTreatment = {
      patientID: patientID?.value, // Use selected value from react-select
      doctorID: doctorID?.value,
      startDate,
      endDate,
      treatmentType,
      billingAmount,
      satisfactionScore: parseFloat(satisfactionScore), // Include satisfaction score in the request
      status,
      details,
    };

    try {
      const response = await fetch("http://localhost:4000/treatments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTreatment),
      });

      if (!response.ok) {
        throw new Error("Failed to add new treatment");
      }

      setSuccess("Treatment added successfully!");
      setPatientID(null);
      setDoctorID(null);
      setStartDate("");
      setEndDate("");
      setTreatmentType("");
      setBillingAmount("");
      setSatisfactionScore(""); // Reset satisfaction score
      setStatus("");
      setDetails("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 uppercase text-center text-pretty text-teal-500">
        New Treatment
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Patient
          </label>
          <Select
            value={patientID}
            onChange={(selectedOption) => setPatientID(selectedOption)}
            options={patients}
            placeholder="Select a patient"
            isClearable
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Doctor
          </label>
          <Select
            value={doctorID}
            onChange={(selectedOption) => setDoctorID(selectedOption)}
            options={doctors}
            placeholder="Select a doctor"
            isClearable
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Treatment Type
          </label>
          <input
            type="text"
            value={treatmentType}
            onChange={(e) => setTreatmentType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter treatment type"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Billing Amount
          </label>
          <input
            type="number"
            value={billingAmount}
            onChange={(e) => setBillingAmount(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter billing amount"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Satisfaction Score (0.00 - 5.00)
          </label>
          <input
            type="number"
            value={satisfactionScore}
            onChange={(e) => setSatisfactionScore(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter satisfaction score"
            min="0.00"
            max="5.00"
            step="0.01"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Details
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter treatment details"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-teal-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Treatment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewTreatment;
