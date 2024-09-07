import React, { useState, useEffect } from "react";
import { FaDownload, FaPlus } from "react-icons/fa";
import AddTrainingMaterial from "./AddTrainingMaterial"; // Import your AddTrainingMaterial component

const TrainingMaterialPage = () => {
  const [trainingMaterials, setTrainingMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchTrainingMaterials = async () => {
      try {
        const response = await fetch("http://localhost:3000/trainingMaterials");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTrainingMaterials(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTrainingMaterials();
  }, []);

  const handleAddTrainingMaterial = (newMaterial) => {
    setTrainingMaterials((prev) => [...prev, newMaterial]);
    setShowAddModal(false); // Close modal after adding
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
      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 flex items-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
      >
        <FaPlus className="mr-2" /> Add Training Material
      </button>
      {showAddModal && (
        <AddTrainingMaterial
          onAdd={handleAddTrainingMaterial}
          closeModal={() => setShowAddModal(false)}
        />
      )}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Training Name
            </th>
            <th className="py-3 px-4 text-left border-b border-gray-300">
              Department
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Document URL
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-300">
              Download
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {trainingMaterials.map((material) => (
            <tr
              key={material._id}
              className="border-b border-gray-300 hover:bg-gray-100"
            >
              <td className="py-3 px-4 text-left whitespace-nowrap border-r border-gray-300">
                {material.TrainingName}
              </td>
              <td className="py-3 px-4 text-left whitespace-nowrap border-r border-gray-300">
                {material.Department}
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap border-r border-gray-300">
                <a
                  href={material.DocumentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {material.DocumentURL}
                </a>
              </td>
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <a
                  href={material.DocumentURL}
                  download
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <FaDownload size={20} className="mr-1" /> Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingMaterialPage;
