import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

import Journey from '../models/Journey.js';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// Get Public Profile (No Auth Required)
router.get('/public/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // 1. Fetch User (Basic details only)
        const user = await User.findById(userId).select('fullName points avatar badges level createdAt');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Fetch Journey Stats
        const journeys = await Journey.find({ userId });
        let totalEmissions = 0;
        let totalSaved = 0;
        const carBaselineFactor = 0.21;

        journeys.forEach(journey => {
            totalEmissions += journey.emissions;
            const baselineEmission = journey.distance * carBaselineFactor;
            totalSaved += (baselineEmission - journey.emissions);
        });

        // 3. Calculate Streak (Same logic as activity.js)
        const logsDesc = await ActivityLog.find({ userId }).sort({ date: -1 });
        const logDates = logsDesc.map(l => l.date);
        let streak = 0;
        let d = new Date();
        const todayStr = d.toISOString().split('T')[0];
        let hasToday = logDates.includes(todayStr);

        while (true) {
            const dStr = d.toISOString().split('T')[0];
            if (logDates.includes(dStr)) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                if (dStr === todayStr && !hasToday) {
                    d.setDate(d.getDate() - 1);
                    continue;
                }
                break;
            }
        }

        // 4. Return aggregated public data
        res.json({
            id: user._id,
            fullName: user.fullName,
            avatar: user.avatar,
            points: user.points,
            badges: user.badges || [],
            joinedAt: user.createdAt,
            stats: {
                streak,
                totalSaved: Math.round(totalSaved * 10) / 10,
                totalEmissions: Math.round(totalEmissions * 10) / 10
            }
        });

    } catch (error) {
        console.error("Public Profile Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

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
