const pool = require('../config/database');

/**
 * Subject model – wraps all database operations for the subjects table.
 */
class Subject {
  /**
   * Creates a new subject.
   * @param {object} data - { name, code, description, credits, teacher_id }
   * @returns {object} The newly created subject row.
   */
  static async create({ name, code, description, credits, teacher_id }) {
    const query = `
      INSERT INTO subjects (name, code, description, credits, teacher_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const result = await pool.query(query, [name, code, description, credits, teacher_id]);
    return result.rows[0];
  }

  /**
   * Retrieves all subjects, including the teacher's name.
   * @returns {object[]} Array of subject rows.
   */
  static async findAll() {
    const query = `
      SELECT s.*, u.name AS teacher_name
      FROM subjects s
      LEFT JOIN users u ON s.teacher_id = u.id
      ORDER BY s.name`;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Finds a subject by its primary key.
   * @param {number} id
   * @returns {object|undefined} The subject row, or undefined if not found.
   */
  static async findById(id) {
    const query = `
      SELECT s.*, u.name AS teacher_name
      FROM subjects s
      LEFT JOIN users u ON s.teacher_id = u.id
      WHERE s.id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Updates an existing subject.
   * @param {number} id
   * @param {object} data - Fields to update.
   * @returns {object|undefined} The updated row, or undefined if not found.
   */
  static async update(id, { name, code, description, credits, teacher_id }) {
    const query = `
      UPDATE subjects
      SET name = $1, code = $2, description = $3, credits = $4, teacher_id = $5
      WHERE id = $6
      RETURNING *`;
    const result = await pool.query(query, [name, code, description, credits, teacher_id, id]);
    return result.rows[0];
  }

  /**
   * Deletes a subject by id.
   * @param {number} id
   * @returns {object|undefined} The deleted row, or undefined if not found.
   */
  static async delete(id) {
    const query = 'DELETE FROM subjects WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Subject;
