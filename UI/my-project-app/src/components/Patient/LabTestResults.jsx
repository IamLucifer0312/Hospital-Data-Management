import React, { useState, useEffect } from "react";

const LabResultsTable = () => {
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabResults = async () => {
      try {
        const response = await fetch("http://localhost:3000/labResults");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLabResults(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      }
    };

    fetchLabResults();
  }, []);

  const getPatientName = async (patientID) => {
    try {
      const response = await fetch(
        `http://localhost:4000/patients/${patientID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(`${data.FirstName} ${data.LastName}`);
      return `${data.FirstName} ${data.LastName}`;
    } catch (error) {
      console.log(error);
      return "Unknown";
    }
  };

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
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Patient
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Staff In Charge
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Test Type
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Result
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Reference Value
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Unit
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Test Date
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {labResults.map((result) => (
            <tr
              key={result._id}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="py-3 px-4 text-left whitespace-nowrap border-r border-gray-300">
                {result.PatientID}
              </td>
              <td className="py-3 px-4 text-left whitespace-nowrap border-r border-gray-300">
                {result.StaffInCharge}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {result.TestType}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {result.Result}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {result.ReferenceValue}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {result.Unit}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {result.TestDate !== "Invalid Date"
                  ? new Date(result.TestDate).toLocaleString()
                  : "Invalid Date"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabResultsTable;
