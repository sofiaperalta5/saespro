const express = require('express');
const { body } = require('express-validator');
const gradeController = require('../controllers/gradeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

/** Validation rules for creating a grade. */
const createValidation = [
  body('enrollment_id').isInt().withMessage('El enrollment_id debe ser un número entero'),
  body('grade')
    .isFloat({ min: 0, max: 10 })
    .withMessage('La calificación debe estar entre 0 y 10'),
];

/** Validation rules for updating a grade. */
const updateValidation = [
  body('grade')
    .isFloat({ min: 0, max: 10 })
    .withMessage('La calificación debe estar entre 0 y 10'),
];

// All grade routes require authentication
router.use(authMiddleware);

router.get('/', gradeController.getAll);
router.get('/enrollment/:enrollment_id', gradeController.getByEnrollment);
router.get('/:id', gradeController.getById);
router.post('/', roleMiddleware('admin', 'teacher'), createValidation, gradeController.create);
router.put('/:id', roleMiddleware('admin', 'teacher'), updateValidation, gradeController.update);
router.delete('/:id', roleMiddleware('admin', 'teacher'), gradeController.remove);

module.exports = router;
