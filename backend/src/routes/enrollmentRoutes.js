const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, enrollmentController.getAll);
router.post('/', authMiddleware, enrollmentController.create);
router.delete('/:id', authMiddleware, enrollmentController.delete);

module.exports = router;
