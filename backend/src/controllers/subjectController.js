const Subject = require('../models/Subject');

exports.getAll = async (req, res) => {
  try {
    const subjects = await Subject.getAll();
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener materias' });
  }
};

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

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });
    const subject = await Subject.create(name, description || '');
    res.status(201).json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear materia' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });
    const subject = await Subject.update(req.params.id, name, description || '');
    if (!subject) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar materia' });
  }
};

exports.delete = async (req, res) => {
  try {
    const subject = await Subject.delete(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Materia no encontrada' });
    res.json({ message: 'Materia eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
};
