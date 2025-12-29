// routes/messageDeepSeek.js (new file)
const express = require('express');
const router = express.Router();

// Friendly student assistant AI
function generateResponse(message) {
    const msg = message.toLowerCase();

    // Productivity tips
    if (msg.includes('productivity') || msg.includes('focus') || msg.includes('concentration')) {
        return "Great question! Try the Pomodoro technique: study for 25 minutes straight, then take a 5-minute break. It really helps maintain focus and prevents burnout. You've got this!";
    }

    // Coding and studies
    if (msg.includes('coding') || msg.includes('programming') || msg.includes('study') || msg.includes('learn')) {
        return "Coding is awesome! Start with small projects, practice daily, and don't be afraid to ask for help. Remember, every expert was once a beginner. Keep coding!";
    }

    // Motivation
    if (msg.includes('motivation') || msg.includes('motivated') || msg.includes('lazy') || msg.includes('tired')) {
        return "I understand feeling unmotivated sometimes. Set small, achievable goals and celebrate your wins! Remember why you started your journey. You're capable of amazing things!";
    }

    // Time management
    if (msg.includes('time') || msg.includes('schedule') || msg.includes('manage') || msg.includes('organize')) {
        return "Time management is key! Create a daily schedule with dedicated study blocks, breaks, and fun time. Use tools like calendars or apps to stay organized. Balance is important!";
    }

    // General encouragement
    if (msg.includes('help') || msg.includes('advice') || msg.includes('tip')) {
        return "I'm here to help! Whether it's study tips, motivation, or time management, just ask. You're doing great by seeking ways to improve. Keep up the excellent work!";
    }

    // Random or unclear questions
    return "That's an interesting question! As your study buddy, I'm here to support you with productivity tips, coding advice, motivation boosts, and time management strategies. What would you like to chat about today?";
}

router.post('/message', async (req, res) => {
    try {
        const { message, email } = req.body;

        console.log('Received message:', message);

        const response = generateResponse(message);

        res.json({
            success: true,
            response: response,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;