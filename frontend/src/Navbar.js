import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated }) {
  const navigate = useNavigate();
  const user = isAuthenticated ? JSON.parse(localStorage.getItem('user')) : null;
  const isTeacher = user?.role === 'teacher';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 onClick={() => navigate('/')}>📚 Mi App</h2>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              {isTeacher && (
                <button onClick={() => navigate('/teacher-grades')}>
                  Agregar Calificaciones
                </button>
              )}
              <button onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button onClick={() => navigate('/profile')}>Perfil</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;