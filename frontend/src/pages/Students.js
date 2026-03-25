import React, { useState, useEffect } from 'react';
import api from '../api';

function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [boleta, setBoleta] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (err) {
      setError('Error al cargar estudiantes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !boleta.trim()) {
      setError('Nombre y boleta son requeridos');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, { name: name.trim(), boleta: boleta.trim(), email: email.trim() });
        setSuccess('✓ Estudiante actualizado correctamente');
        setEditingId(null);
      } else {
        await api.post('/students', { name: name.trim(), boleta: boleta.trim(), email: email.trim() });
        setSuccess('✓ Estudiante registrado correctamente');
      }
      setName('');
      setBoleta('');
      setEmail('');
      await fetchStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar estudiante');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setName(student.name);
    setBoleta(student.boleta);
    setEmail(student.email || '');
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este estudiante?')) return;
    try {
      await api.delete(`/students/${id}`);
      await fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar estudiante');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setBoleta('');
    setEmail('');
    setError('');
  };

  return (
    <div>
      <h1>Gestión de Estudiantes</h1>

      {error && <p style={{ color: '#f44336', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: '#4caf50', fontWeight: 'bold' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h2>
        <div>
          <label>Nombre *</label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Boleta *</label>
          <input
            type="text"
            placeholder="Ej: 202405"
            value={boleta}
            onChange={(e) => setBoleta(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="email@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Registrar Estudiante'}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        )}
      </form>

      <h2 style={{ marginTop: '40px' }}>Estudiantes Registrados ({students.length})</h2>

      {students.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No hay estudiantes registrados</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Boleta</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nombre</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{student.boleta}</td>
                <td style={{ padding: '10px' }}>{student.name}</td>
                <td style={{ padding: '10px' }}>{student.email || '-'}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(student)}
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
                    onClick={() => handleDelete(student.id)}
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

export default Students;
