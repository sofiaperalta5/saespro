import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404</h1>
      <p>Página no encontrada</p>
      <button onClick={() => navigate('/')}>Volver a Inicio</button>
    </div>
  );
}

export default NotFound;