const { validationResult } = require('express-validator');
const Enrollment = require('../models/Enrollment');

/**
 * GET /api/enrollments
 * Returns all enrollments.
 */
exports.getAll = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll();
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};

/**
 * GET /api/enrollments/student/:student_id
 * Returns all enrollments for a specific student.
 */
exports.getByStudent = async (req, res) => {
  try {
    const enrollments = await Enrollment.findByStudent(req.params.student_id);
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener inscripciones del estudiante' });
  }
};

/**
 * GET /api/enrollments/:id
 * Returns a single enrollment by id.
 */
exports.getById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Inscripción no encontrada' });
    res.json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener inscripción' });
  }
};

/**
 * POST /api/enrollments
 * Creates a new enrollment.
 */
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { student_id, subject_id, period } = req.body;
    const enrollment = await Enrollment.create({ student_id, subject_id, period });
    res.status(201).json({ message: 'Inscripción creada exitosamente', enrollment });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).json({ error: 'El estudiante ya está inscrito en esta materia para este periodo' });
    if (err.code === '23503') return res.status(400).json({ error: 'Estudiante o materia no encontrados' });
    res.status(500).json({ error: 'Error al crear inscripción' });
  }
};

/**
 * DELETE /api/enrollments/:id
 * Deletes an enrollment.
 */
exports.remove = async (req, res) => {
  try {
    const enrollment = await Enrollment.delete(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Inscripción no encontrada' });
    res.json({ message: 'Inscripción eliminada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
};
