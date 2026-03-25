const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Global rate limiter – protects all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes, intenta de nuevo más tarde' },
});
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth',        require('./routes/authRoutes'));
app.use('/api/subjects',    require('./routes/subjectRoutes'));
app.use('/api/students',    require('./routes/studentRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/grades',      require('./routes/gradeRoutes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Start server
const PORT = process.env.PORT || 5000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al inicializar la base de datos:', err);
    process.exit(1);
  });