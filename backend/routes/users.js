import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find()
            .sort({ points: -1 })
            .select('fullName points')
            .limit(50); // Limit to top 50 for performance

        const leaderboard = users.map(user => ({
            id: user._id,
            name: user.fullName,
            score: user.points,
            // Assign a random eco-avatar based on id/name logic or just random for now if not in DB
            avatar: ['🌿', '⚡', '🌍', '🌱', '🚴', '☀️', '🌳', '♻️'][user.fullName.length % 8]
        }));

        res.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
