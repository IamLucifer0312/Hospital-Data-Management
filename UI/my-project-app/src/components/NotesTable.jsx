import React, { useState, useEffect } from "react";

const NotesTable = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/notes");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNotes(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

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
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left border-b border-gray-300">ID</th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Patient ID
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Appointment ID
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Doctor ID
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Note
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {notes.map((note) => (
            <tr
              key={note._id}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {note._id}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {note.PatientID || "N/A"}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {note.AppointmentID || "N/A"}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {note.DoctorID || "N/A"}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {note.Note || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotesTable;
