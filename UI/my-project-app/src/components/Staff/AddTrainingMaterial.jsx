import React, { useState } from "react";

const AddTrainingMaterial = ({ onAdd, closeModal }) => {
  const [newMaterial, setNewMaterial] = useState({
    TrainingName: "",
    Department: "Cardiology", // Set default value
    DocumentType: "url", // 'url' or 'file'
    DocumentURL: "",
    File: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;

    if (newMaterial.DocumentType === "url") {
      payload = {
        TrainingName: newMaterial.TrainingName,
        Department: newMaterial.Department,
        DocumentURL: newMaterial.DocumentURL,
      };
    } else if (newMaterial.DocumentType === "file" && newMaterial.File) {
      const formData = new FormData();
      formData.append("TrainingName", newMaterial.TrainingName);
      formData.append("Department", newMaterial.Department);
      formData.append("file", newMaterial.File);

      try {
        const response = await fetch(
          "http://localhost:3000/trainingMaterials",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload training material");
        }

        const result = await response.json();
        onAdd(result); // Notify parent component to update the list
        closeModal(); // Close modal after adding
        return;
      } catch (error) {
        console.error("Error uploading training material:", error);
      }
    }

    try {
      const response = await fetch("http://localhost:3000/trainingMaterials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add training material");
      }

      const result = await response.json();
      onAdd(result); // Notify parent component to update the list
      closeModal(); // Close modal after adding
    } catch (error) {
      console.error("Error adding training material:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Add Training Material</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Training Name</label>
            <input
              type="text"
              value={newMaterial.TrainingName}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, TrainingName: e.target.value })
              }
              required
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Department</label>
            <select
              value={newMaterial.Department}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, Department: e.target.value })
              }
              className="border rounded w-full py-2 px-3"
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Oncology">Oncology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Document Type</label>
            <select
              value={newMaterial.DocumentType}
              onChange={(e) =>
                setNewMaterial({ ...newMaterial, DocumentType: e.target.value })
              }
              className="border rounded w-full py-2 px-3"
            >
              <option value="url">Text URL</option>
              <option value="file">Upload File</option>
            </select>
          </div>
          {newMaterial.DocumentType === "url" ? (
            <div className="mb-4">
              <label className="block text-gray-700">Document URL</label>
              <input
                type="url"
                value={newMaterial.DocumentURL}
                onChange={(e) =>
                  setNewMaterial({
                    ...newMaterial,
                    DocumentURL: e.target.value,
                  })
                }
                required
                className="border rounded w-full py-2 px-3"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700">Upload File</label>
              <input
                type="file"
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, File: e.target.files[0] })
                }
                required
                className="border rounded w-full py-2 px-3"
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTrainingMaterial;
