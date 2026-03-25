const { validationResult } = require('express-validator');
const Subject = require('../models/Subject');

/**
 * GET /api/subjects
 * Returns all subjects.
 */
exports.getAll = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener materias' });
  }
};

/**
 * GET /api/subjects/:id
 * Returns a single subject by id.
 */
exports.getById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener materia' });
  }
};

/**
 * POST /api/subjects
 * Creates a new subject. Requires admin or teacher role.
 */
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, code, description, credits, teacher_id } = req.body;
    const subject = await Subject.create({ name, code, description, credits, teacher_id });
    res.status(201).json({ message: 'Materia creada exitosamente', subject });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).json({ error: 'El código de materia ya existe' });
    res.status(500).json({ error: 'Error al crear materia' });
  }
};

/**
 * PUT /api/subjects/:id
 * Updates an existing subject.
 */
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, code, description, credits, teacher_id } = req.body;
    const subject = await Subject.update(req.params.id, { name, code, description, credits, teacher_id });
    if (!subject) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json({ message: 'Materia actualizada exitosamente', subject });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).json({ error: 'El código de materia ya existe' });
    res.status(500).json({ error: 'Error al actualizar materia' });
  }
};

/**
 * DELETE /api/subjects/:id
 * Deletes a subject.
 */
exports.remove = async (req, res) => {
  try {
    const subject = await Subject.delete(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json({ message: 'Materia eliminada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
};
