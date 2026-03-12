import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [grades, setGrades] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const allGrades = JSON.parse(localStorage.getItem('allGrades')) || [];
    const userGrades = allGrades.filter(grade => grade.studentId === user.studentId);
    setGrades(userGrades);
  }, [user?.studentId]);

  if (!user) {
    return <p>Cargando...</p>;
  }

  const riskGrades = grades.filter(grade => grade.score < 6);
  const approvedGrades = grades.filter(grade => grade.score >= 6);

  const getAdvice = (score) => {
    if (score >= 9) return '¡Excelente desempeño! Continúa así.';
    if (score >= 8) return 'Muy buen trabajo. Sigue esforzándote.';
    if (score >= 7) return 'Buen trabajo. Puedes mejorar un poco más.';
    if (score >= 6) return 'Aprobado. Dedica más tiempo a esta materia.';
    return 'Necesitas ayuda. Habla con tu profesor y estudia más.';
  };

  return (
    <div>
      <h1>Mis Calificaciones</h1>
      <p>Boleta: {user.studentId}</p>

      {riskGrades.length > 0 && (
        <div style={{
          background: '#ffebee',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          borderLeft: '4px solid #f44336'
        }}>
          <h3 style={{ color: '#c62828', margin: '0 0 10px 0' }}>
            ⚠️ Materias en Riesgo ({riskGrades.length})
          </h3>
          {riskGrades.map(grade => (
            <div key={grade.id} style={{
              background: 'white',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              borderLeft: '4px solid #f44336'
            }}>
              <strong>{grade.subject}</strong>
              <p style={{ margin: '5px 0', color: '#f44336' }}>
                Calificación: {grade.score}/10
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                💡 {getAdvice(grade.score)}
              </p>
            </div>
          ))}
        </div>
      )}

      {approvedGrades.length > 0 && (
        <div style={{
          background: '#e8f5e9',
          padding: '15px',
          borderRadius: '5px',
          borderLeft: '4px solid #4caf50'
        }}>
          <h3 style={{ color: '#2e7d32', margin: '0 0 10px 0' }}>
            ✓ Materias Aprobadas ({approvedGrades.length})
          </h3>
          {approvedGrades.map(grade => (
            <div key={grade.id} style={{
              background: 'white',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              borderLeft: '4px solid #4caf50'
            }}>
              <strong>{grade.subject}</strong>
              <p style={{ margin: '5px 0', color: '#4caf50' }}>
                Calificación: {grade.score}/10
              </p>
            </div>
          ))}
        </div>
      )}

      {grades.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '30px' }}>
          No hay calificaciones registradas aún
        </p>
      )}
    </div>
  );
}

export default Dashboard;