const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(email, password, name) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name';
    const result = await pool.query(query, [email, hashedPassword, name]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, name FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;