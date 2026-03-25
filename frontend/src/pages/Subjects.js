import React, { useState, useEffect } from 'react';
import api from '../api';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (err) {
      setError('Error al cargar materias');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('El nombre de la materia es requerido');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/subjects/${editingId}`, { name: name.trim(), description: description.trim() });
        setSuccess('✓ Materia actualizada correctamente');
        setEditingId(null);
      } else {
        await api.post('/subjects', { name: name.trim(), description: description.trim() });
        setSuccess('✓ Materia creada correctamente');
      }
      setName('');
      setDescription('');
      await fetchSubjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar materia');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setName(subject.name);
    setDescription(subject.description || '');
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta materia?')) return;
    try {
      await api.delete(`/subjects/${id}`);
      await fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar materia');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setError('');
  };

  return (
    <div>
      <h1>Gestión de Materias</h1>

      {error && <p style={{ color: '#f44336', fontWeight: 'bold' }}>{error}</p>}
      {success && <p style={{ color: '#4caf50', fontWeight: 'bold' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Editar Materia' : 'Nueva Materia'}</h2>
        <div>
          <label>Nombre *</label>
          <input
            type="text"
            placeholder="Ej: Matemáticas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <input
            type="text"
            placeholder="Descripción opcional"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Materia'}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        )}
      </form>

      <h2 style={{ marginTop: '40px' }}>Materias Registradas ({subjects.length})</h2>

      {subjects.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No hay materias registradas</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nombre</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Descripción</th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => (
              <tr key={subject.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{subject.name}</td>
                <td style={{ padding: '10px' }}>{subject.description || '-'}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(subject)}
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
                    onClick={() => handleDelete(subject.id)}
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

export default Subjects;
