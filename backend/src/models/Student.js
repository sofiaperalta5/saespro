const pool = require('../config/database');

/**
 * Student model – wraps all database operations for the students table.
 */
class Student {
  /**
   * Creates a new student record linked to an existing user.
   * @param {object} data - { user_id, student_code, career, semester }
   * @returns {object} The newly created student row.
   */
  static async create({ user_id, student_code, career, semester }) {
    const query = `
      INSERT INTO students (user_id, student_code, career, semester)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const result = await pool.query(query, [user_id, student_code, career, semester]);
    return result.rows[0];
  }

  /**
   * Retrieves all students, including the linked user's name and email.
   * @returns {object[]} Array of student rows.
   */
  static async findAll() {
    const query = `
      SELECT st.*, u.name, u.email
      FROM students st
      JOIN users u ON st.user_id = u.id
      ORDER BY u.name`;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Finds a student by its primary key.
   * @param {number} id
   * @returns {object|undefined} The student row, or undefined if not found.
   */
  static async findById(id) {
    const query = `
      SELECT st.*, u.name, u.email
      FROM students st
      JOIN users u ON st.user_id = u.id
      WHERE st.id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Finds a student by the linked user id.
   * @param {number} user_id
   * @returns {object|undefined} The student row, or undefined if not found.
   */
  static async findByUserId(user_id) {
    const query = `
      SELECT st.*, u.name, u.email
      FROM students st
      JOIN users u ON st.user_id = u.id
      WHERE st.user_id = $1`;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }

  /**
   * Updates a student record.
   * @param {number} id
   * @param {object} data - Fields to update.
   * @returns {object|undefined} The updated row, or undefined if not found.
   */
  static async update(id, { student_code, career, semester }) {
    const query = `
      UPDATE students
      SET student_code = $1, career = $2, semester = $3
      WHERE id = $4
      RETURNING *`;
    const result = await pool.query(query, [student_code, career, semester, id]);
    return result.rows[0];
  }

  /**
   * Deletes a student record by id.
   * @param {number} id
   * @returns {object|undefined} The deleted row, or undefined if not found.
   */
  static async delete(id) {
    const query = 'DELETE FROM students WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Student;
