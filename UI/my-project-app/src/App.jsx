import "./App.css";
import LoginPage from "./LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import PrivateRoute from "./components/common/PrivateRoute";
import UnauthorizedPage from "./components/common/UnauthorizedPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/main-page"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route path="/401" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
