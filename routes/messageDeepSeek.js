// routes/messageDeepSeek.js (new file)
const express = require('express');
const router = express.Router();

router.post('/message', async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        // Message processing logic here
        console.log('Received message:', message);
        
        res.json({ 
            success: true, 
            response: "Message received successfully",
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;