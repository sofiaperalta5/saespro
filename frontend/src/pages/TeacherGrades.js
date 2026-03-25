import React, { useState, useEffect } from 'react';
import api from '../api';

function TeacherGrades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [score, setScore] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGrades();
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await api.get('/grades');
      setGrades(response.data);
    } catch (err) {
      setError('Error al cargar calificaciones');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Error al cargar estudiantes', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (err) {
      console.error('Error al cargar materias', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editingId && (!studentId || !subjectId || !score)) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (editingId && !score) {
      setError('Por favor ingresa la calificación');
      return;
    }

    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError('La calificación debe ser entre 0 y 10');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/grades/${editingId}`, { score: scoreNum });
        setSuccess('✓ Calificación actualizada correctamente');
        setEditingId(null);
      } else {
        await api.post('/grades', { student_id: studentId, subject_id: subjectId, score: scoreNum });
        setSuccess('✓ Calificación agregada correctamente');
      }
      setStudentId('');
      setSubjectId('');
      setScore('');
      await fetchGrades();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar calificación');
    } finally {
      setLoading(false);
    }
  };

  const deleteGrade = async (id) => {
    if (!window.confirm('¿Eliminar esta calificación?')) return;
    try {
      await api.delete(`/grades/${id}`);
      await fetchGrades();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar calificación');
    }
  };

  const editGrade = (grade) => {
    setEditingId(grade.id);
    setScore(grade.score.toString());
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setStudentId('');
    setSubjectId('');
    setScore('');
    setError('');
  };

  return (
    <div>
      <h1>Agregar Calificaciones</h1>

      {error && <p style={{ color: '#f44336', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: '#4caf50', fontWeight: 'bold' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        {!editingId && (
          <>
            <div>
              <label>Estudiante</label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
                <option value="">Selecciona un estudiante</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.boleta})</option>
                ))}
              </select>
            </div>

            <div>
              <label>Materia</label>
              <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
                <option value="">Selecciona una materia</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label>Calificación (0-10)</label>
          <input
            type="number"
            placeholder="0"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            min="0"
            max="10"
            step="0.5"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : editingId ? 'Actualizar Calificación' : 'Agregar Calificación'}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        )}
      </form>

      <h2 style={{ marginTop: '40px' }}>Calificaciones Registradas ({grades.length})</h2>

      {grades.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No hay calificaciones registradas</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Boleta</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Estudiante</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Materia</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Calificación</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(grade => (
              <tr key={grade.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{grade.boleta}</td>
                <td style={{ padding: '10px' }}>{grade.student_name}</td>
                <td style={{ padding: '10px' }}>{grade.subject_name}</td>
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
                    onClick={() => editGrade(grade)}
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
