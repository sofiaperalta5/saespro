const pool = require('../config/database');

/**
 * Enrollment model – wraps database operations for the enrollments table.
 */
class Enrollment {
  /**
   * Creates a new enrollment.
   * @param {object} data - { student_id, subject_id, period }
   * @returns {object} The newly created enrollment row.
   */
  static async create({ student_id, subject_id, period }) {
    const query = `
      INSERT INTO enrollments (student_id, subject_id, period)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const result = await pool.query(query, [student_id, subject_id, period]);
    return result.rows[0];
  }

  /**
   * Retrieves all enrollments with student and subject details.
   * @returns {object[]} Array of enrollment rows.
   */
  static async findAll() {
    const query = `
      SELECT e.*,
             u.name  AS student_name,
             s.name  AS subject_name,
             s.code  AS subject_code
      FROM enrollments e
      JOIN students st ON e.student_id = st.id
      JOIN users    u  ON st.user_id   = u.id
      JOIN subjects s  ON e.subject_id  = s.id
      ORDER BY e.created_at DESC`;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Finds all enrollments for a specific student.
   * @param {number} student_id
   * @returns {object[]} Array of enrollment rows.
   */
  static async findByStudent(student_id) {
    const query = `
      SELECT e.*,
             s.name  AS subject_name,
             s.code  AS subject_code,
             s.credits
      FROM enrollments e
      JOIN subjects s ON e.subject_id = s.id
      WHERE e.student_id = $1
      ORDER BY e.period DESC`;
    const result = await pool.query(query, [student_id]);
    return result.rows;
  }

  /**
   * Finds an enrollment by its primary key.
   * @param {number} id
   * @returns {object|undefined} The enrollment row, or undefined if not found.
   */
  static async findById(id) {
    const query = `
      SELECT e.*,
             u.name  AS student_name,
             s.name  AS subject_name,
             s.code  AS subject_code
      FROM enrollments e
      JOIN students st ON e.student_id = st.id
      JOIN users    u  ON st.user_id   = u.id
      JOIN subjects s  ON e.subject_id  = s.id
      WHERE e.id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Deletes an enrollment by id.
   * @param {number} id
   * @returns {object|undefined} The deleted row, or undefined if not found.
   */
  static async delete(id) {
    const query = 'DELETE FROM enrollments WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Enrollment;
