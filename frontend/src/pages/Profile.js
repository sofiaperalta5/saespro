import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Perfil</h1>
      <p>Email: usuario@example.com</p>
      <p>Nombre: Juan Pérez</p>
      <button onClick={() => navigate('/dashboard')}>Volver al Dashboard</button>
    </div>
  );
}

export default Profile;