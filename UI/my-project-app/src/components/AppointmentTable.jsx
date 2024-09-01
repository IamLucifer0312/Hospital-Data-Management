import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
            <th className="py-3 px-6 text-left">Appointment ID</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Start Time</th>
            <th className="py-3 px-6 text-left">End Time</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Purpose</th>
            <th className="py-3 px-6 text-left">Patient</th>
            <th className="py-3 px-6 text-left">Doctor</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {sortedAppointments.map((appointment) => (
            <tr
              key={appointment.AppointmentID}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {appointment.AppointmentID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {new Date(appointment.AppointmentDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {appointment.AppointmentStartTime}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {appointment.AppointmentEndTime}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {appointment.AppointmentStatus}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {appointment.Purpose}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {`${appointment.PatientFirstName} ${appointment.PatientLastName}`}
                <br />
                <span className="text-sm text-gray-500">
                  {appointment.PatientPhoneNum}
                </span>
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {`${appointment.DoctorFirstName} ${appointment.DoctorLastName}`}
                <br />
                <span className="text-sm text-gray-500">
                  {appointment.DoctorQualification}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
