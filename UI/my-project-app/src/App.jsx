import './App.css'
import LoginPage from './LoginPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';


function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/main-page" element={<MainPage />} />
    </Routes>
  </Router>
  );
}

export default App
