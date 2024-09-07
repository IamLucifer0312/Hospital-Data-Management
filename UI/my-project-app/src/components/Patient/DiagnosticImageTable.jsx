import React, { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";

const DiagnosticImageTable = () => {
  const [diagnosticImages, setDiagnosticImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchDiagnosticImages = async () => {
      try {
        const response = await fetch("http://localhost:3000/diagnosticImage");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDiagnosticImages(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchDiagnosticImages();
  }, []);

  const handleDownload = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageName || "diagnostic-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
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
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              Patient Name
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300 w-1/12">
              Staff In Charge
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Image Type
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Date
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300 w-3/12">
              Description
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300 w-3/12">
              Image
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {diagnosticImages.map((image) => (
            <tr
              key={image._id}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="py-3 px-4 text-left whitespace-nowrap border-r border-gray-300 w-1/12">
                {image.PatientName}
              </td>
              <td className="py-3 px-4 text-left whitespace-nowrap border-r border-gray-300 w-1/12">
                {image.StaffID}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {image.ImageType}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {image.Date !== "Invalid Date"
                  ? new Date(image.Date).toLocaleString()
                  : "Invalid Date"}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                {image.Description}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap flex items-center space-x-2">
                {image.ImageURL ? (
                  <>
                    <img
                      src={`http://localhost:3000${image.ImageURL}`}
                      alt="Diagnostic"
                      className="h-52 w-42 object-cover border border-gray-300 cursor-pointer mr-5"
                      onClick={() => setSelectedImage(image.ImageURL)}
                    />
                    <button
                      onClick={() =>
                        handleDownload(
                          `http://localhost:3000${image.ImageURL}`,
                          image._id
                        )
                      }
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaDownload size={20} />
                    </button>
                  </>
                ) : (
                  "No Image"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`http://localhost:3000${selectedImage}`}
            alt="Diagnostic"
            className="h-auto max-w-full max-h-full border border-white"
          />
        </div>
      )}
    </div>
  );
};

export default DiagnosticImageTable;
