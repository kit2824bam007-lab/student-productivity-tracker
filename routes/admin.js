const express = require('express');
const { getAllStudents, getStatistics, getPerformancePrediction } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/students', getAllStudents);
router.get('/stats', getStatistics);
router.get('/prediction/:id', getPerformancePrediction);

module.exports = router;