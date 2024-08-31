import React, { useState } from "react";
import {
  FaUser,
  FaUserMd,
  FaHistory,
  FaCalendarAlt,
  FaChartBar,
  FaChevronRight,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import StaffTable from "./components/StaffTable";
import logo from "./assets/hospital-logo.svg";
import DiagnosticImageTable from "./components/DiagnosticImageTable";
import NotesTable from "./components/NotesTable";
import DepartmentTable from "./components/DepartmentTable";
import AddNewStaffPage from "./components/AddNewStaffPage";

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("Staff");
  const [activeSubsection, setActiveSubsection] = useState("Tables");

  const sections = [
    {
      name: "Staff",
      icon: <FaUserMd size={24} />,
      subOptions: [
        "All infomation",
        "Department",
        "Notes",
        "Add new Staff",
        "Update Staff Schedule",
      ],
    },
    {
      name: "Patient",
      icon: <FaUser size={24} />,
      subOptions: ["All infomation", "Diagnostic Images"],
    },
    {
      name: "Treatment History",
      icon: <FaHistory size={24} />,
      subOptions: ["All infomation"],
    },
    {
      name: "Appointment",
      icon: <FaCalendarAlt size={24} />,
      subOptions: ["All infomation"],
    },
    {
      name: "Report",
      icon: <FaChartBar size={24} />,
      subOptions: [
        "PatientTreatmentReport",
        "StaffWorkloadReport",
        "StaffPerformanceReport",
      ],
    },
  ];

  const renderContent = () => {
    switch (activeSubsection) {
      case "All infomation":
        switch (activeSection) {
          case "Patient":
            return (
              <div>
                <p>Table</p>
              </div>
            );
          case "Staff":
            return <StaffTable />;
          case "Treatment History":
            return (
              <div>
                <p>Table</p>
              </div>
            );
          case "Appointment":
            return (
              <div>
                <p>Table</p>
              </div>
            );
          default:
            return null;
        }
      case "Notes":
        return <NotesTable />;
      case "Diagnostic Images":
        return <DiagnosticImageTable />;
      case "Department":
        return <DepartmentTable />;
      case "Staff Schedules":
        return (
          <div>
            <p>Table</p>
          </div>
        );
      case "Add new Staff":
        return <AddNewStaffPage />;
      case "PatientTreatmentReport":
        return (
          <div>
            <p>Table</p>
          </div>
        );
      case "StaffWorkloadReport":
        return (
          <div>
            <p>Table</p>
          </div>
        );
      case "StaffPerformanceReport":
        return (
          <div>
            <p>Table</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-20 bg-teal-700 text-white flex flex-col items-center py-10 space-y-8 h-full">
        <div className="mb-8 rounded-lg">
          <img src={logo} alt="Logo" className="h-20 w-20" />
        </div>
        {sections.map((section) => (
          <div
            key={section.name}
            className={`cursor-pointer p-2 rounded-lg flex justify-center items-center ${
              activeSection === section.name ? "bg-blue-400 text-white" : ""
            }`}
            onClick={() => setActiveSection(section.name)}
          >
            {section.icon}
          </div>
        ))}
      </div>

      <div className="w-64 bg-gray-100 text-gray-800 flex flex-col py-8 px-6 h-full">
        <div className="flex items-center h-20">
          {" "}
          <h2 className="text-3xl font-bold uppercase ml-3 text-red-500">
            {activeSection}
          </h2>
        </div>
        <ul className="space-y-6 mt-12">
          {sections
            .find((section) => section.name === activeSection)
            .subOptions.map((subOption) => (
              <li
                key={subOption}
                className={`text-xl text-pretty cursor-pointer px-6 py-3 rounded-md flex justify-between items-center hover:bg-blue-100 hover:text-blue-600 transition-all ${
                  activeSubsection === subOption
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-800"
                }`}
                onClick={() => setActiveSubsection(subOption)}
              >
                {subOption}
                <span>
                  {activeSubsection === subOption ? <FaChevronRight /> : ""}
                </span>
              </li>
            ))}
        </ul>
      </div>

      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-1/2">
            <input
              type="text"
              className="bg-white border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              placeholder="Search"
            />
            <FaSearch className="absolute left-3 top-2/4 transform -translate-y-2/4 text-gray-500" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold">Group9</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <FaUserCircle size={36} className="text-gray-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center uppercase text-pretty">
          {`${activeSubsection}`}
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default MainPage;
