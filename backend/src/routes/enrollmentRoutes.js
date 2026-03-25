const express = require('express');
const { body } = require('express-validator');
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

/** Validation rules for creating an enrollment. */
const enrollmentValidation = [
  body('student_id').isInt().withMessage('El student_id debe ser un número entero'),
  body('subject_id').isInt().withMessage('El subject_id debe ser un número entero'),
  body('period').trim().notEmpty().withMessage('El periodo es requerido'),
];

// All enrollment routes require authentication
router.use(authMiddleware);

router.get('/', enrollmentController.getAll);
router.get('/student/:student_id', enrollmentController.getByStudent);
router.get('/:id', enrollmentController.getById);
router.post('/', roleMiddleware('admin', 'teacher'), enrollmentValidation, enrollmentController.create);
router.delete('/:id', roleMiddleware('admin'), enrollmentController.remove);

module.exports = router;
