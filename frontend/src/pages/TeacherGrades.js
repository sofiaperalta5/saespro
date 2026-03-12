import React, { useState, useEffect } from 'react';

function TeacherGrades() {
  const [grades, setGrades] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const allGrades = JSON.parse(localStorage.getItem('allGrades')) || [];
    setGrades(allGrades);
  }, []);

  const addGrade = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!studentId.trim() || !subject.trim() || !score) {
      setError('Por favor completa todos los campos');
      return;
    }

    const scoreNum = parseFloat(score);
    if (scoreNum < 0 || scoreNum > 10 || isNaN(scoreNum)) {
      setError('La calificación debe ser entre 0 y 10');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const newGrade = {
      id: Date.now(),
      studentId: studentId.trim(),
      subject: subject.trim(),
      score: scoreNum,
      createdAt: new Date().toLocaleDateString(),
      teacher: user ? user.email : 'unknown'
    };

    const updatedGrades = [...grades, newGrade];
    setGrades(updatedGrades);
    localStorage.setItem('allGrades', JSON.stringify(updatedGrades));

    setStudentId('');
    setSubject('');
    setScore('');
    setSuccess('✓ Calificación agregada correctamente');
  };

  const deleteGrade = (id) => {
    const updatedGrades = grades.filter(grade => grade.id !== id);
    setGrades(updatedGrades);
    localStorage.setItem('allGrades', JSON.stringify(updatedGrades));
  };

  const editGrade = (id) => {
    const grade = grades.find(g => g.id === id);
    if (grade) {
      setStudentId(grade.studentId);
      setSubject(grade.subject);
      setScore(grade.score.toString());
      deleteGrade(id);
    }
  };

  return (
    <div>
      <h1>Agregar Calificaciones</h1>

      {error && <p style={{ color: '#f44336', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: '#4caf50', fontWeight: 'bold' }}>{success}</p>}

      <form onSubmit={addGrade}>
        <input
          type="text"
          placeholder="Número de boleta del estudiante"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nombre de la materia"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Calificación (0-10)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          min="0"
          max="10"
          step="0.5"
          required
        />
        <button type="submit">Agregar Calificación</button>
      </form>

      <h2 style={{ marginTop: '40px' }}>Calificaciones Registradas</h2>

      {grades.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No hay calificaciones registradas</p>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
          background: 'white'
        }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Boleta</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Materia</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Calificación</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(grade => (
              <tr key={grade.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{grade.studentId}</td>
                <td style={{ padding: '10px' }}>{grade.subject}</td>
                <td style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: grade.score < 6 ? '#f44336' : '#4caf50'
                }}>
                  {grade.score}/10
                </td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => editGrade(grade.id)}
                    style={{
                      background: '#ff9800',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      width: 'auto'
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteGrade(grade.id)}
                    style={{
                      background: '#f44336',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      width: 'auto'
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TeacherGrades;