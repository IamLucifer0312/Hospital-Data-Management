import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUserMd,
  FaHistory,
  FaCalendarAlt,
  FaChartBar,
  FaChevronRight,
  FaUserCircle,
} from "react-icons/fa";
import StaffTable from "./components/StaffTable";
import logo from "./assets/hospital-logo.svg";
import DiagnosticImageTable from "./components/DiagnosticImageTable";
import NotesTable from "./components/NotesTable";
import DepartmentTable from "./components/DepartmentTable";
import AddNewStaffPage from "./components/AddNewStaffPage";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("Staff");
  const [activeSubsection, setActiveSubsection] = useState("All infomation");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
    if (!loggedInUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const sections = [
    {
      name: "Staff",
      icon: <FaUserMd size={24} />,
      subOptions: [
        "All infomation",
        "Department",
        "Notes",
        ...(user?.role === "admin" ? ["Add new Staff"] : []),
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
    user?.role === "admin"
      ? {
          name: "Report",
          icon: <FaChartBar size={24} />,
          subOptions: [
            "PatientTreatmentReport",
            "StaffWorkloadReport",
            "StaffPerformanceReport",
          ],
        }
      : {},
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

      <div className="w-52 bg-gray-100 text-gray-800 flex flex-col py-8 px-6 h-full">
        <div className="flex items-center h-20">
          <h2 className="text-xl font-bold uppercase ml-3 text-red-500">
            {activeSection}
          </h2>
        </div>
        <ul className="space-y-6 mt-12">
          {sections
            .find((section) => section.name === activeSection)
            .subOptions.map((subOption) => (
              <li
                key={subOption}
                className={`text-md text-pretty cursor-pointer font-semibold px-2 py-3 rounded-md flex justify-between items-center hover:bg-blue-100 hover:text-blue-600 transition-all ${
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
        <div className="flex justify-end items-center mb-8 relative">
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <FaUserCircle
              size={36}
              className="text-gray-500 cursor-pointer"
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-12 bg-white border border-gray-300 rounded-lg shadow-lg py-2 w-48">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
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
