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
import StaffTable from "./StaffTable";

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("Staff");
  const [activeSubsection, setActiveSubsection] = useState("Tables");

  const sections = [
    {
      name: "Staff",
      icon: <FaUserMd size={24} />,
      subOptions: ["Tables", "Notes", "Staff Schedules"],
    },
    { name: "Patient", icon: <FaUser size={24} />, subOptions: ["Tables"] },
    {
      name: "Treatment History",
      icon: <FaHistory size={24} />,
      subOptions: ["Tables"],
    },
    {
      name: "Appointment",
      icon: <FaCalendarAlt size={24} />,
      subOptions: ["Tables"],
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
      case "Tables":
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
        return (
          <div>
            <p>Table</p>
          </div>
        );
      case "Staff Schedules":
        return (
          <div>
            <p>Table</p>
          </div>
        );
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
      <div className="w-16 bg-blue-700 text-white flex flex-col items-center py-10 space-y-6 h-full">
        {sections.map((section) => (
          <div
            key={section.name}
            className={`cursor-pointer ${
              activeSection === section.name ? "text-blue-300" : ""
            }`}
            onClick={() => {
              setActiveSection(section.name);
              setActiveSubsection(section.subOptions[0]);
            }}
          >
            {section.icon}
          </div>
        ))}
      </div>

      <div className="w-64 bg-gray-100 text-gray-800 flex flex-col py-8 px-6 h-full">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">{activeSection}</h2>
        </div>
        <ul className="space-y-6">
          {sections
            .find((section) => section.name === activeSection)
            .subOptions.map((subOption) => (
              <li
                key={subOption}
                className={`cursor-pointer px-6 py-3 rounded-md flex justify-between items-center hover:bg-blue-100 hover:text-blue-600 transition-all ${
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
            {" "}
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

        <h1 className="text-4xl font-bold mb-8 text-center">
          {`${activeSection} ${activeSubsection}`}
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default MainPage;
