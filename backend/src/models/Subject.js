const pool = require('../config/database');

class Subject {
  static async getAll() {
    const result = await pool.query('SELECT * FROM subjects ORDER BY name ASC');
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM subjects WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(name, description) {
    const result = await pool.query(
      'INSERT INTO subjects (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return result.rows[0];
  }

  static async update(id, name, description) {
    const result = await pool.query(
      'UPDATE subjects SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM subjects WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Subject;
