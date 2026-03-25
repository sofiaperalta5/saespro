const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool', err);
});

/**
 * Initializes the database schema, creating all necessary tables if they
 * do not already exist. Should be called once on server startup.
 */
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id        SERIAL PRIMARY KEY,
        email     VARCHAR(255) UNIQUE NOT NULL,
        password  VARCHAR(255) NOT NULL,
        name      VARCHAR(255) NOT NULL,
        role      VARCHAR(50)  NOT NULL DEFAULT 'student',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        code        VARCHAR(50)  UNIQUE NOT NULL,
        description TEXT,
        credits     INTEGER      NOT NULL DEFAULT 3,
        teacher_id  INTEGER      REFERENCES users(id) ON DELETE SET NULL,
        created_at  TIMESTAMPTZ  DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS students (
        id           SERIAL PRIMARY KEY,
        user_id      INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        student_code VARCHAR(50) UNIQUE NOT NULL,
        career       VARCHAR(255),
        semester     INTEGER,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id         SERIAL PRIMARY KEY,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
        period     VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(student_id, subject_id, period)
      );

      CREATE TABLE IF NOT EXISTS grades (
        id            SERIAL PRIMARY KEY,
        enrollment_id INTEGER        NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
        grade         NUMERIC(5, 2)  NOT NULL,
        comments      TEXT,
        created_at    TIMESTAMPTZ    DEFAULT NOW(),
        updated_at    TIMESTAMPTZ    DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_subjects_teacher ON subjects(teacher_id);
      CREATE INDEX IF NOT EXISTS idx_students_user    ON students(user_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
      CREATE INDEX IF NOT EXISTS idx_enrollments_subject ON enrollments(subject_id);
      CREATE INDEX IF NOT EXISTS idx_grades_enrollment   ON grades(enrollment_id);
    `);
    console.log('✅ Base de datos inicializada correctamente');
  } finally {
    client.release();
  }
}

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;