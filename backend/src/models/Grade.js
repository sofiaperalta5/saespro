const pool = require('../config/database');

/**
 * Grade model – wraps all database operations for the grades table.
 */
class Grade {
  /**
   * Creates a new grade entry.
   * @param {object} data - { enrollment_id, grade, comments }
   * @returns {object} The newly created grade row.
   */
  static async create({ enrollment_id, grade, comments }) {
    const query = `
      INSERT INTO grades (enrollment_id, grade, comments)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const result = await pool.query(query, [enrollment_id, grade, comments]);
    return result.rows[0];
  }

  /**
   * Retrieves all grades with student and subject details.
   * @returns {object[]} Array of grade rows.
   */
  static async findAll() {
    const query = `
      SELECT g.*,
             u.name  AS student_name,
             s.name  AS subject_name,
             s.code  AS subject_code,
             e.period
      FROM grades g
      JOIN enrollments e ON g.enrollment_id = e.id
      JOIN students   st ON e.student_id    = st.id
      JOIN users       u ON st.user_id      = u.id
      JOIN subjects    s ON e.subject_id    = s.id
      ORDER BY g.created_at DESC`;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Finds all grades for a specific enrollment.
   * @param {number} enrollment_id
   * @returns {object[]} Array of grade rows.
   */
  static async findByEnrollment(enrollment_id) {
    const query = `
      SELECT * FROM grades
      WHERE enrollment_id = $1
      ORDER BY created_at DESC`;
    const result = await pool.query(query, [enrollment_id]);
    return result.rows;
  }

  /**
   * Finds a grade by its primary key.
   * @param {number} id
   * @returns {object|undefined} The grade row, or undefined if not found.
   */
  static async findById(id) {
    const query = `
      SELECT g.*,
             u.name  AS student_name,
             s.name  AS subject_name,
             e.period
      FROM grades g
      JOIN enrollments e ON g.enrollment_id = e.id
      JOIN students   st ON e.student_id    = st.id
      JOIN users       u ON st.user_id      = u.id
      JOIN subjects    s ON e.subject_id    = s.id
      WHERE g.id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Updates a grade entry.
   * @param {number} id
   * @param {object} data - { grade, comments }
   * @returns {object|undefined} The updated row, or undefined if not found.
   */
  static async update(id, { grade, comments }) {
    const query = `
      UPDATE grades
      SET grade = $1, comments = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *`;
    const result = await pool.query(query, [grade, comments, id]);
    return result.rows[0];
  }

  /**
   * Deletes a grade by id.
   * @param {number} id
   * @returns {object|undefined} The deleted row, or undefined if not found.
   */
  static async delete(id) {
    const query = 'DELETE FROM grades WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Grade;
