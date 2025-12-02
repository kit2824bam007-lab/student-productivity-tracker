// routes/mobileUsage.js (new file)
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.post('/', async (req, res) => {
    try {
        const { studentId, deviceType, screenTime, appUsage } = req.body;
        
        const usageData = {
            deviceType,
            screenTime,
            appUsage,
            timestamp: new Date()
        };

        await Student.findByIdAndUpdate(
            studentId,
            { $push: { mobileUsage: usageData } }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;