import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

import { checkBadges } from '../utils/badgeUtils.js';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Log Activity (Increment count for today)
router.post('/log', verifyToken, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const userId = req.user.id;

        // Find existing log for today
        let log = await ActivityLog.findOne({ userId, date: today });

        if (log) {
            log.count += 1;
            log.lastUpdated = Date.now();
            await log.save();
        } else {
            log = new ActivityLog({
                userId,
                date: today,
                count: 1
            });
            await log.save();
        }

        // Calculate Streak
        // 1. Get all unique dates sorted descending
        const logs = await ActivityLog.find({ userId }).sort({ date: -1 });
        let streak = 0;
        let currentCheckDate = new Date();

        // Normalize current date to YYYY-MM-DD
        const todayStr = currentCheckDate.toISOString().split('T')[0];

        // If the latest log is today, start checking from today.
        // If the latest log is yesterday, start checking from yesterday.
        // If getting logs, map them to simple strings
        const logDates = logs.map(l => l.date);

        // Check if we have a log for today
        let hasToday = logDates.includes(todayStr);

        // Simple streak logic: 
        // If we have today, streak starts at 1 and we check backwards.
        // If we don't have today, check if we have yesterday.

        // Pointer to iterate days
        let d = new Date();

        while (true) {
            const dStr = d.toISOString().split('T')[0];
            if (logDates.includes(dStr)) {
                streak++;
                d.setDate(d.getDate() - 1);
            } else {
                // If it's today and we haven't logged yet, don't break streak if yesterday exists
                if (dStr === todayStr && !hasToday) {
                    d.setDate(d.getDate() - 1);
                    continue;
                }
                break;
            }
        }

        // Check for badges
        const newBadges = await checkBadges(userId, { type: 'ACTIVITY' });

        res.json({ message: 'Activity logged', streak, newBadges });

    } catch (error) {
        console.error('Activity Log Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Activity Data (Last 365 days)
router.get('/data', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch logs
        const logs = await ActivityLog.find({
            userId
        }).sort({ date: 1 }); // Ascending

        // Calculate simple streak again for display
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

        res.json({
            activityLog: logs,
            streak,
            lastActiveDate: logsDesc.length > 0 ? logsDesc[0].date : null
        });

    } catch (error) {
        console.error('Get Activity Data Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
