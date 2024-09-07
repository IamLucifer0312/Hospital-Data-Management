import React, { useState, useEffect } from "react";

const StaffCertificateModal = ({ staff, closeModal }) => {
  const [certificate, setCertificate] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/staffCertificates/staff/${staff.StaffID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch certificates");
        }
        const data = await response.json();
        setCertificate(data[0]);
      } catch (error) {
        console.log(error);
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, [staff.StaffID]);

  const handleAddCertificate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Add diagnostic image data
    formData.append("StaffID", staff.StaffID);
    formData.append("StaffName", `${staff.FirstName} ${staff.LastName}`);

    // Handle image upload if selected
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      const response = await fetch(
        `http://localhost:3000/staffCertificates/${certificate._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add certificate");
      }

      const result = await response.json();
      setCertificate(result); // Add new certificate to the list
      setSuccessMessage("Certificate added successfully!");
    } catch (err) {
      console.error(err);
      setSuccessMessage("Failed to add certificate.");
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
          Staff Certificate
        </h2>

        {/* Display certificate */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Certificate:</h3>
          {certificate ? (
            <div className="flex flex-col items-center">
              <img
                src={`http://localhost:3000${certificate.ImageURL}`} // Adjust this based on your actual field name for the image URL
                alt={certificate.ImageURL}
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          ) : (
            <p>No certificate found.</p>
          )}
        </div>

        {/* Form to add new certificate */}
        <form onSubmit={handleAddCertificate}>
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Certificate Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Certificate
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

export default StaffCertificateModal;
