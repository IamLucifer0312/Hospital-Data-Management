import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";

const NotesModal = ({ appointmentID, staffID, patientID, closeModal }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffName, setStaffName] = useState("");
  const [patientName, setPatientName] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    setNotes([]);
    setLoading(true);
    setError(null);
    setStaffName("");
    setPatientName("");

    const fetchNotesAndNames = async () => {
      try {
        const notesResponse = await fetch(
          `http://localhost:3000/notes?appointmentID=${appointmentID}`
        );
        if (notesResponse.status === 404) {
          setError("NO AVAILABLE NOTES FOR THIS APPOINTMENT");
          setLoading(false);
          return;
        } else if (!notesResponse.ok) {
          throw new Error("Failed to fetch notes.");
        }
        const notesData = await notesResponse.json();
        setNotes(notesData);

        if (notesData.length > 0) {
          const staffResponse = await fetch(
            `http://localhost:4000/staffs/${staffID}`
          );
          if (!staffResponse.ok)
            throw new Error("Failed to fetch staff details.");
          const staffData = await staffResponse.json();
          setStaffName(`${staffData.FirstName} ${staffData.LastName}`);

          const patientResponse = await fetch(
            `http://localhost:4000/patients/${patientID}`
          );
          if (!patientResponse.ok)
            throw new Error("Failed to fetch patient details.");
          const patientData = await patientResponse.json();
          setPatientName(`${patientData.FirstName} ${patientData.LastName}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotesAndNames();
  }, [appointmentID, staffID, patientID]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <p>Loading notes...</p>;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-10 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 uppercase text-center">
          Notes for Appointment {appointmentID}
        </h2>
        {notes.length > 0 && (
          <div className="mt-10">
            <p className="text-lg">
              <strong>Doctor:</strong> {staffName}
            </p>
            <p className="text-lg">
              <strong>Patient:</strong> {patientName}
            </p>
          </div>
        )}
        {error ? (
          <div className="text-center text-2 mt-10 text-red-500 uppercase">
            {error}
          </div>
        ) : notes.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 mt-10">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left text-lg">Note ID</th>
                <th className="py-3 px-6 text-left text-lg">Note</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-md font-light">
              {notes.map((note) => (
                <tr
                  key={note._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {note._id}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {note.Note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-lg mt-10">
            No notes available for this appointment.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesModal;
