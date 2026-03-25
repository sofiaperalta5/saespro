const express = require('express');
const { body } = require('express-validator');
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

/** Validation rules for creating/updating a subject. */
const subjectValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('code').trim().notEmpty().withMessage('El código es requerido'),
  body('credits')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Los créditos deben ser un número entero positivo'),
  body('teacher_id')
    .optional({ nullable: true })
    .isInt()
    .withMessage('El id del profesor debe ser un número entero'),
];

// All subject routes require authentication
router.use(authMiddleware);

router.get('/', subjectController.getAll);
router.get('/:id', subjectController.getById);
router.post('/', roleMiddleware('admin', 'teacher'), subjectValidation, subjectController.create);
router.put('/:id', roleMiddleware('admin', 'teacher'), subjectValidation, subjectController.update);
router.delete('/:id', roleMiddleware('admin'), subjectController.remove);

module.exports = router;
