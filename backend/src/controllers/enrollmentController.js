const Enrollment = require('../models/Enrollment');

exports.getAll = async (req, res) => {
  try {
    const enrollments = await Enrollment.getAll();
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};

exports.create = async (req, res) => {
  try {
    const { student_id, subject_id } = req.body;
    if (!student_id || !subject_id) {
      return res.status(400).json({ error: 'Estudiante y materia son requeridos' });
    }
    const enrollment = await Enrollment.create(student_id, subject_id);
    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear inscripción' });
  }
};

exports.delete = async (req, res) => {
  try {
    const enrollment = await Enrollment.delete(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Inscripción no encontrada' });
    res.json({ message: 'Inscripción eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
};
