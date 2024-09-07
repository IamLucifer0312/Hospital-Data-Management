import React, { useState } from "react";

const AddLabResultModal = ({ patient, closeModal }) => {
  const [firstName, setFirstName] = useState(patient.FirstName);

  // Lab Test Fields
  const [staffID, setStaffID] = useState("");
  const [testType, setTestType] = useState("");
  const [testDate, setTestDate] = useState("");
  const [result, setResult] = useState("");
  const [referenceValue, setReferenceValue] = useState("");
  const [unit, setUnit] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Lab Test Type Options with corresponding Unit and Reference Values
  const testTypes = {
    "Blood Glucose": { unit: "mg/dL", referenceValue: "70-110" },
    Cholesterol: { unit: "mg/dL", referenceValue: "<200" },
    Hemoglobin: { unit: "g/dL", referenceValue: "13.8-17.2" },
    "White Blood Cell": { unit: "cells/µL", referenceValue: "4500-11000" },
    "Red Blood Cell": { unit: "million cells/µL", referenceValue: "4.7-6.1" },
    "Blood Urea Nitrogen (BUN)": { unit: "mg/dL", referenceValue: "7-20" },
    Creatinine: { unit: "mg/dL", referenceValue: "0.6-1.2" },
    "Thyroid Stimulating Hormone (TSH)": {
      unit: "mIU/L",
      referenceValue: "0.4-4.0",
    },
    "Platelet Count": { unit: "platelets/µL", referenceValue: "150000-450000" },
    "C-Reactive Protein (CRP)": { unit: "mg/L", referenceValue: "<3" },
  };

  const handleTestTypeChange = (e) => {
    const selectedTestType = e.target.value;
    setTestType(selectedTestType);

    if (testTypes[selectedTestType]) {
      setUnit(testTypes[selectedTestType].unit);
      setReferenceValue(testTypes[selectedTestType].referenceValue);
    } else {
      setUnit("");
      setReferenceValue("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const labTestData = {
      PatientID: patient.PatientID,
      StaffID: staffID,
      TestType: testType,
      TestDate: testDate,
      Result: result,
      ReferenceValue: referenceValue,
      Unit: unit,
    };

    try {
      const response = await fetch(`http://localhost:3000/labResults`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(labTestData),
      });

      if (!response.ok) {
        throw new Error("Failed to add lab result");
      }

      setSuccessMessage("Lab result added successfully!");
    } catch (err) {
      console.error(err);
      setSuccessMessage("Failed to add lab result.");
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
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
        <h2 className="text-2xl font-bold mb-6 text-blue-500 text-center uppercase">
          Add Lab Result
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Existing patient info fields */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Patient's Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              readOnly
            />
          </div>

          {/* Lab Test Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Staff ID
            </label>
            <input
              type="number"
              value={staffID}
              onChange={(e) => setStaffID(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Test Type
            </label>
            <select
              value={testType}
              onChange={handleTestTypeChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Test Type</option>
              {Object.keys(testTypes).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Test Date
            </label>
            <input
              type="datetime-local"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Result
            </label>
            <input
              type="number"
              step="any"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Reference Value
            </label>
            <input
              type="text"
              value={referenceValue}
              onChange={(e) => setReferenceValue(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              readOnly
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Unit
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              readOnly
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Lab Result
            </button>
          </div>
        </form>

        {successMessage && (
          <p className="mt-4 uppercase font-bold text-center text-green-600">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddLabResultModal;
