import React, { useState } from "react";

const DoctorScheduleViewer = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const fetchSchedules = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/schedules/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch schedules.");
      }

      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      setError("Failed to fetch schedules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-teal-500 text-center uppercase">
        Doctor Schedules
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        onClick={fetchSchedules}
        className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600"
      >
        View Schedules
      </button>

      {loading && <p className="mt-4 text-center">Loading...</p>}

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {schedules.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-center">Schedules</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center w-1/5">Doctor Name</th>
                <th className="py-3 px-6 text-center w-1/5">Day of the Week</th>
                <th className="py-3 px-6 text-center w-1/5">Start Time</th>
                <th className="py-3 px-6 text-center w-1/5">End Time</th>
                <th className="py-3 px-6 text-center w-1/5">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {schedules.map((schedule, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    {schedule.DoctorName}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    {schedule.DayOfWeek}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    {schedule.StartTime}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    {schedule.EndTime}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        schedule.Status === "Busy"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {schedule.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorScheduleViewer;
