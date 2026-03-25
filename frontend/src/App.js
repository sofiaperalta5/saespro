import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import TeacherGrades from './pages/TeacherGrades';
import Subjects from './pages/Subjects';
import Students from './pages/Students';
import Enrollments from './pages/Enrollments';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/teacher-grades" element={isAuthenticated ? <TeacherGrades /> : <Navigate to="/login" />} />
        <Route path="/subjects" element={isAuthenticated ? <Subjects /> : <Navigate to="/login" />} />
        <Route path="/students" element={isAuthenticated ? <Students /> : <Navigate to="/login" />} />
        <Route path="/enrollments" element={isAuthenticated ? <Enrollments /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;