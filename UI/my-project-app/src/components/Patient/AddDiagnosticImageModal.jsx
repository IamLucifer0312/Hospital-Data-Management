import React, { useState } from "react";

const AddDiagnosticImageModal = ({ patient, closeModal }) => {
  const [firstName, setFirstName] = useState(patient.FirstName);

  // Diagnostic Image Fields
  const [staffID, setStaffID] = useState("");
  const [imageType, setImageType] = useState("");
  const [imageDate, setImageDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Add diagnostic image data
    formData.append("PatientID", patient.PatientID);
    formData.append("PatientName", `${patient.FirstName} ${patient.LastName}`);
    formData.append("StaffID", staffID);
    formData.append("ImageType", imageType);
    formData.append("Date", imageDate);
    formData.append("Description", description);

    // Handle image upload if selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`http://localhost:3000/diagnosticImage`, {
        method: "POST",
        body: formData, // Using FormData for file upload
      });

      if (!response.ok) {
        throw new Error("Failed to add image");
      }

      const result = await response.json();
      setSuccessMessage("Added successfully!");
    } catch (err) {
      console.error(err);
      setSuccessMessage("Failed to add image.");
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
          Add Diagnostic Image
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            />
          </div>

          {/* Diagnostic Image Fields */}
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
              Image Type
            </label>
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Image Type</option>
              <option value="X-Ray">X-Ray</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
              {/* Add other options as needed */}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image Date
            </label>
            <input
              type="datetime-local"
              value={imageDate}
              onChange={(e) => setImageDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Image
            </label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              accept="image/*"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Image
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

export default AddDiagnosticImageModal;
