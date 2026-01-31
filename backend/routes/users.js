import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find()
            .sort({ points: -1 })
            .select('fullName points avatar')
            .limit(50); // Limit to top 50 for performance

        const leaderboard = users.map(user => ({
            id: user._id,
            name: user.fullName,
            score: user.points,
            avatar: user.avatar || ['🌿', '⚡', '🌍', '🌱', '🚴', '☀️', '🌳', '♻️'][user.fullName.length % 8]
        }));

        res.json(leaderboard);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Avatar
router.put('/update-avatar', verifyToken, async (req, res) => {
    try {
        const { avatar } = req.body;

        // Simple validation or sanitation could go here

        await User.findByIdAndUpdate(req.userId, { avatar });

        res.json({ message: 'Avatar updated', avatar });
    } catch (error) {
        console.error("Update Avatar Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
