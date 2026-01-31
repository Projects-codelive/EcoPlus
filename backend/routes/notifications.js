import express from 'express';
import Notification from '../models/Notification.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get notifications for current user
router.get('/', verifyToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark all as read
router.put('/read-all', verifyToken, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.userId, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
