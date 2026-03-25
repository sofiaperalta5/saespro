const express = require('express');
const subjectController = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, subjectController.getAll);
router.get('/:id', authMiddleware, subjectController.getById);
router.post('/', authMiddleware, subjectController.create);
router.put('/:id', authMiddleware, subjectController.update);
router.delete('/:id', authMiddleware, subjectController.delete);

module.exports = router;
