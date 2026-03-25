const { validationResult } = require('express-validator');
const Student = require('../models/Student');

/**
 * GET /api/students
 * Returns all students.
 */
exports.getAll = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
};

/**
 * GET /api/students/:id
 * Returns a single student by id.
 */
exports.getById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estudiante' });
  }
};

/**
 * POST /api/students
 * Creates a new student profile.
 */
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { user_id, student_code, career, semester } = req.body;
    const student = await Student.create({ user_id, student_code, career, semester });
    res.status(201).json({ message: 'Estudiante creado exitosamente', student });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).json({ error: 'El código o usuario ya existe' });
    if (err.code === '23503') return res.status(400).json({ error: 'El usuario indicado no existe' });
    res.status(500).json({ error: 'Error al crear estudiante' });
  }
};

/**
 * PUT /api/students/:id
 * Updates an existing student.
 */
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { student_code, career, semester } = req.body;
    const student = await Student.update(req.params.id, { student_code, career, semester });
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json({ message: 'Estudiante actualizado exitosamente', student });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).json({ error: 'El código de estudiante ya existe' });
    res.status(500).json({ error: 'Error al actualizar estudiante' });
  }
};

/**
 * DELETE /api/students/:id
 * Deletes a student.
 */
exports.remove = async (req, res) => {
  try {
    const student = await Student.delete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json({ message: 'Estudiante eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar estudiante' });
  }
};
