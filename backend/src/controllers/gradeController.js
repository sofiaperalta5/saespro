const { validationResult } = require('express-validator');
const Grade = require('../models/Grade');

/**
 * GET /api/grades
 * Returns all grades.
 */
exports.getAll = async (req, res) => {
  try {
    const grades = await Grade.findAll();
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
};

/**
 * GET /api/grades/enrollment/:enrollment_id
 * Returns all grades for a specific enrollment.
 */
exports.getByEnrollment = async (req, res) => {
  try {
    const grades = await Grade.findByEnrollment(req.params.enrollment_id);
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener calificaciones de la inscripción' });
  }
};

/**
 * GET /api/grades/:id
 * Returns a single grade by id.
 */
exports.getById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ error: 'Calificación no encontrada' });
    res.json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener calificación' });
  }
};

/**
 * POST /api/grades
 * Creates a new grade entry.
 */
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { enrollment_id, grade, comments } = req.body;
    const newGrade = await Grade.create({ enrollment_id, grade, comments });
    res.status(201).json({ message: 'Calificación registrada exitosamente', grade: newGrade });
  } catch (err) {
    console.error(err);
    if (err.code === '23503') return res.status(400).json({ error: 'La inscripción indicada no existe' });
    res.status(500).json({ error: 'Error al registrar calificación' });
  }
};

/**
 * PUT /api/grades/:id
 * Updates an existing grade.
 */
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { grade, comments } = req.body;
    const updated = await Grade.update(req.params.id, { grade, comments });
    if (!updated) return res.status(404).json({ error: 'Calificación no encontrada' });
    res.json({ message: 'Calificación actualizada exitosamente', grade: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar calificación' });
  }
};

/**
 * DELETE /api/grades/:id
 * Deletes a grade.
 */
exports.remove = async (req, res) => {
  try {
    const grade = await Grade.delete(req.params.id);
    if (!grade) return res.status(404).json({ error: 'Calificación no encontrada' });
    res.json({ message: 'Calificación eliminada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar calificación' });
  }
};
