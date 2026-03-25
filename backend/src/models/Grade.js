const pool = require('../config/database');

class Grade {
  static async getAll() {
    const result = await pool.query(`
      SELECT g.*, s.name AS student_name, s.boleta, sub.name AS subject_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN subjects sub ON g.subject_id = sub.id
      ORDER BY g.created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM grades WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(student_id, subject_id, score, teacher_id) {
    const result = await pool.query(
      'INSERT INTO grades (student_id, subject_id, score, teacher_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [student_id, subject_id, score, teacher_id]
    );
    return result.rows[0];
  }

  static async update(id, score) {
    const result = await pool.query(
      'UPDATE grades SET score = $1 WHERE id = $2 RETURNING *',
      [score, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM grades WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Grade;
