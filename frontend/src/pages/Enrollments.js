import React, { useState, useEffect } from 'react';
import api from '../api';

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments');
      setEnrollments(response.data);
    } catch (err) {
      setError('Error al cargar inscripciones');
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

    if (!studentId || !subjectId) {
      setError('Selecciona un estudiante y una materia');
      return;
    }

    setLoading(true);
    try {
      await api.post('/enrollments', { student_id: studentId, subject_id: subjectId });
      setSuccess('✓ Estudiante inscrito correctamente');
      setStudentId('');
      setSubjectId('');
      await fetchEnrollments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al inscribir estudiante');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta inscripción?')) return;
    try {
      await api.delete(`/enrollments/${id}`);
      await fetchEnrollments();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar inscripción');
    }
  };

  return (
    <div>
      <h1>Inscripciones</h1>

      {error && <p style={{ color: '#f44336', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: '#4caf50', fontWeight: 'bold' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <h2>Inscribir Estudiante en Materia</h2>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Inscribiendo...' : 'Inscribir'}
        </button>
      </form>

      <h2 style={{ marginTop: '40px' }}>Inscripciones Registradas ({enrollments.length})</h2>

      {enrollments.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No hay inscripciones registradas</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Boleta</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Estudiante</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Materia</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(enrollment => (
              <tr key={enrollment.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{enrollment.boleta}</td>
                <td style={{ padding: '10px' }}>{enrollment.student_name}</td>
                <td style={{ padding: '10px' }}>{enrollment.subject_name}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(enrollment.id)}
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

export default Enrollments;
