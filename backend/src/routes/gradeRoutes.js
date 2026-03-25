const express = require('express');
const gradeController = require('../controllers/gradeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, gradeController.getAll);
router.post('/', authMiddleware, gradeController.create);
router.put('/:id', authMiddleware, gradeController.update);
router.delete('/:id', authMiddleware, gradeController.delete);

module.exports = router;
