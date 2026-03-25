const pool = require('../config/database');

class Enrollment {
  static async getAll() {
    const result = await pool.query(`
      SELECT e.*, s.name AS student_name, s.boleta, sub.name AS subject_name
      FROM enrollments e
      JOIN students s ON e.student_id = s.id
      JOIN subjects sub ON e.subject_id = sub.id
      ORDER BY e.created_at DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM enrollments WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(student_id, subject_id) {
    const result = await pool.query(
      'INSERT INTO enrollments (student_id, subject_id) VALUES ($1, $2) RETURNING *',
      [student_id, subject_id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM enrollments WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Enrollment;
