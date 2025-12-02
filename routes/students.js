const express = require('express');
const { 
  getDashboard, 
  addMobileUsage, 
  registerCourse, 
  updateCourseProgress, 
  addCertificate, 
  addEvent 
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.post('/mobile-usage', addMobileUsage);
router.post('/register-course', registerCourse);
router.put('/course-progress', updateCourseProgress);
router.post('/certificate', addCertificate);
router.post('/event', addEvent);

module.exports = router;