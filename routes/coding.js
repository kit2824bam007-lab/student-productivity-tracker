const express = require('express');
const { addCodingProfile, getCodingProfile } = require('../controllers/codingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/profile', addCodingProfile);
router.get('/profile/:platform', getCodingProfile);

module.exports = router;