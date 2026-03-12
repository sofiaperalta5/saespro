import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      setError('Email o contraseña incorrectos');
      return;
    }

    localStorage.setItem('token', 'fake-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);

    setEmail('');
    setPassword('');

    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Inicio de Sesión</h1>
      {error && <p style={{ color: '#f44336', fontWeight: 'bold' }}>{error}</p>}
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>

      <p>
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;