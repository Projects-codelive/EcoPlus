import express from 'express';
import Journey from '../models/Journey.js';
import User from '../models/User.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    try {
        const { transportType, distance, fuelEfficiency, emissions } = req.body;

        const newJourney = new Journey({
            userId: req.userId,
            transportType,
            distance,
            fuelEfficiency,
            emissions
        });

        await newJourney.save();

        // Update User Stats
        // Calculate savings: Baseline (Car avg ~0.21 kg/km) - Actual
        const baselineEmission = distance * 0.21;
        const saved = Math.max(0, baselineEmission - emissions); // Don't subtract score if they drive a tank

        // Optional: Add points logic here too (e.g. 10 points per km saved, or flat 50 per log)
        // For now, just updating co2Saved as requested.
        await User.findByIdAndUpdate(req.userId, {
            co2Saved: saved,
            points: 10 // Award 10 points per journey log
        });

        res.status(201).json(newJourney);
    } catch (error) {
        console.error("Journey Log Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Statistics
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const journeys = await Journey.find({ userId: req.userId });

        let totalEmissions = 0;
        let totalSaved = 0;
        const carBaselineFactor = 0.21; // Baseline car emissions (kg/km)

        journeys.forEach(journey => {
            totalEmissions += journey.emissions;

            // Calculate savings: (Distance * Baseline) - Actual Emissions
            // If actual emissions are higher than baseline (e.g., inefficient car), savings might be negative (we clamp to 0 or allow negative?)
            // Usually "Saved" implies positive impact. Let's allow negative if they are driving a gas guzzler, 
            // OR just sum standard savings for "greener" modes.
            // Simplest correct physics:
            const baselineEmission = journey.distance * carBaselineFactor;
            const saving = baselineEmission - journey.emissions;
            totalSaved += saving;
        });

        // Ensure we don't show negative savings if user drives a hummer everywhere, 
        // or effectively show net positive impact. 
        // Let's keep it raw math for now, maybe round to 0 if negative for UI niceness.

        res.json({
            totalEmissions: Math.round(totalEmissions * 100) / 100,
            totalSaved: Math.round(totalSaved * 100) / 100
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const journeys = await Journey.find({ userId: req.userId }).sort({ date: -1 });
        res.json(journeys);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
