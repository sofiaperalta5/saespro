const Grade = require('../models/Grade');

exports.getAll = async (req, res) => {
  try {
    const grades = await Grade.getAll();
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
};

exports.create = async (req, res) => {
  try {
    const { student_id, subject_id, score } = req.body;
    if (!student_id || !subject_id || score === undefined) {
      return res.status(400).json({ error: 'Estudiante, materia y calificación son requeridos' });
    }

    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      return res.status(400).json({ error: 'La calificación debe ser un número entre 0 y 10' });
    }

    const grade = await Grade.create(student_id, subject_id, scoreNum, req.user.id);
    res.status(201).json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear calificación' });
  }
};

exports.update = async (req, res) => {
  try {
    const { score } = req.body;
    if (score === undefined) return res.status(400).json({ error: 'La calificación es requerida' });

    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      return res.status(400).json({ error: 'La calificación debe ser un número entre 0 y 10' });
    }

    const grade = await Grade.update(req.params.id, scoreNum);
    if (!grade) return res.status(404).json({ error: 'Calificación no encontrada' });
    res.json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar calificación' });
  }
};

exports.delete = async (req, res) => {
  try {
    const grade = await Grade.delete(req.params.id);
    if (!grade) return res.status(404).json({ error: 'Calificación no encontrada' });
    res.json({ message: 'Calificación eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar calificación' });
  }
};
