const pool = require('../config/database');

class Student {
  static async getAll() {
    const result = await pool.query('SELECT * FROM students ORDER BY name ASC');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByBoleta(boleta) {
    const result = await pool.query('SELECT * FROM students WHERE boleta = $1', [boleta]);
    return result.rows[0];
  }

  static async create(name, boleta, email) {
    const result = await pool.query(
      'INSERT INTO students (name, boleta, email) VALUES ($1, $2, $3) RETURNING *',
      [name, boleta, email]
    );
    return result.rows[0];
  }

  static async update(id, name, boleta, email) {
    const result = await pool.query(
      'UPDATE students SET name = $1, boleta = $2, email = $3 WHERE id = $4 RETURNING *',
      [name, boleta, email, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Student;
