import React, { useState } from "react";
import hospitalImage from "./assets/login.jpg";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("isAuthenticated", true);
        navigate("/main-page");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed!");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
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
              Hospital Management System
            </h2>
          </div>

          <form onSubmit={handleLogin}>
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
            <div className="mb-6">
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
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-full font-semibold hover:bg-teal-600 transition-colors duration-300"
            >
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
