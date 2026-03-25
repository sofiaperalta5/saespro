const Student = require('../models/Student');

exports.getAll = async (req, res) => {
  try {
    const students = await Student.getAll();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
};

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

exports.create = async (req, res) => {
  try {
    const { name, boleta, email } = req.body;
    if (!name || !boleta) return res.status(400).json({ error: 'Nombre y boleta son requeridos' });

    const existing = await Student.findByBoleta(boleta);
    if (existing) return res.status(400).json({ error: 'La boleta ya está registrada' });

    const student = await Student.create(name, boleta, email || '');
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear estudiante' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, boleta, email } = req.body;
    if (!name || !boleta) return res.status(400).json({ error: 'Nombre y boleta son requeridos' });

    const existing = await Student.findByBoleta(boleta);
    if (existing && existing.id !== parseInt(req.params.id, 10)) {
      return res.status(400).json({ error: 'La boleta ya está registrada por otro estudiante' });
    }

    const student = await Student.update(req.params.id, name, boleta, email || '');
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estudiante' });
  }
};

exports.delete = async (req, res) => {
  try {
    const student = await Student.delete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar estudiante' });
  }
};
