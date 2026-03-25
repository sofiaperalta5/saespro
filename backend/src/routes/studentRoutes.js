const express = require('express');
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

/** Validation rules for creating a student. */
const createValidation = [
  body('user_id').isInt().withMessage('El user_id debe ser un número entero'),
  body('student_code').trim().notEmpty().withMessage('El código de estudiante es requerido'),
  body('semester')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El semestre debe ser un número entero positivo'),
];

/** Validation rules for updating a student. */
const updateValidation = [
  body('student_code').trim().notEmpty().withMessage('El código de estudiante es requerido'),
  body('semester')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El semestre debe ser un número entero positivo'),
];

// All student routes require authentication
router.use(authMiddleware);

router.get('/', roleMiddleware('admin', 'teacher'), studentController.getAll);
router.get('/:id', studentController.getById);
router.post('/', roleMiddleware('admin'), createValidation, studentController.create);
router.put('/:id', roleMiddleware('admin'), updateValidation, studentController.update);
router.delete('/:id', roleMiddleware('admin'), studentController.remove);

module.exports = router;
