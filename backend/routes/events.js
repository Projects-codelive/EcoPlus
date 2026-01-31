import express from 'express';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new event
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { name, date, time, location, requiredVolunteers } = req.body;

        const newEvent = new Event({
            name,
            date,
            time,
            location,
            requiredVolunteers,
            creator: req.userId
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// List all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('creator', 'fullName avatar')
            .populate('volunteers', 'fullName avatar')
            .sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error("List Events Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Join event as volunteer
router.post('/:id/join', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already joined
        if (event.volunteers.includes(req.userId)) {
            return res.status(400).json({ message: 'Already joined this event' });
        }

        // Add volunteer
        event.volunteers.push(req.userId);
        await event.save();

        // Get user details for notification
        const volunteer = await User.findById(req.userId);

        // Notify creator
        if (event.creator.toString() !== req.userId) {
            const notification = new Notification({
                recipient: event.creator,
                message: `${volunteer.fullName} has joined your event "${event.name}". Mobile: ${volunteer.mobileNo}`,
                type: 'VOLUNTEER_JOINED'
            });
            await notification.save();
        }

        res.json(event);
    } catch (error) {
        console.error("Join Event Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
