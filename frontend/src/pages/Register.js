import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !studentId) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
      setError('Este email ya está registrado');
      return;
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      studentId,
      role,
      createdAt: new Date().toLocaleDateString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setEmail('');
    setPassword('');
    setStudentId('');
    setRole('student');
    
    navigate('/login');
  };

  return (
    <div>
      <h1>Registro</h1>
      {error && <p style={{ color: '#f44336' }}>{error}</p>}
      
      <form onSubmit={handleRegister}>
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
        <input
          type="text"
          placeholder="Número de boleta"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="student">Estudiante</option>
          <option value="teacher">Profesor</option>
        </select>

        <button type="submit">Registrarse</button>
      </form>

      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
}

export default Register;