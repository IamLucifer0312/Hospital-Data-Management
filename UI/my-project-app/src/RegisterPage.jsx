import React, { useState } from "react";
import hospitalImage from "./assets/login.jpg"; // Replace with your registration image
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // New state for role selection
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed!");
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex"
      style={{ backgroundImage: `url('/path/to/your/background-image.png')` }}
    >
      <div className="w-1/2 hidden lg:flex items-center justify-center">
        <img
          src={hospitalImage}
          alt="Hospital Illustration"
          className="object-contain max-h-2/3 max-w-full"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <img src={logo} alt="Logo" className="mx-auto mb-4 w-36" />
            <h2 className="text-3xl font-bold text-gray-800">
              Create an Account
            </h2>
          </div>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-user text-gray-400"></i>
                </span>
                <input
                  type="text"
                  id="username"
                  className="w-full px-10 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-lock text-gray-400"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  className="w-full px-10 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-lock text-gray-400"></i>
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-10 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  className="w-full px-10 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Admin">Admin</option>
                  <option value="Patient">Patient</option>
                  {/* Add more roles as needed */}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-full font-semibold hover:bg-teal-600 transition-colors duration-300"
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
