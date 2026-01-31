import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { ALL_POSSIBLE_BADGES } from '../config/badges.js';

export const checkBadges = async (userId, context) => {
    try {
        const user = await User.findById(userId);
        if (!user) return [];

        const currentBadges = user.badges || [];
        const newBadges = [];

        // Helper to check if badge already exists
        const hasBadge = (badgeName) => currentBadges.includes(badgeName);

        // Fetch activity logs for day/streak based badges
        const activityLogs = await ActivityLog.find({ userId }).sort({ date: 1 });
        const uniqueDays = activityLogs.length;

        // Context contains data from the triggering event (e.g., quiz completion)
        // context = { type: 'QUIZ', subject: 'Climate Science', score: 100, timestamp: Date.now(), totalQuizzes: 5 }

        for (const badge of ALL_POSSIBLE_BADGES) {
            if (hasBadge(badge.name)) continue;

            let earned = false;

            switch (badge.id) {
                case 1: // Seed Planter: Complete first quiz
                    if (context.type === 'QUIZ') earned = true;
                    break;
                case 2: // Climate Scholar: 2 Climate Science quizzes
                    // This requires persistent tracking of quiz subjects. simpler: assume context passes total subject count
                    if (context.type === 'QUIZ' && context.subject === 'Climate Science' && context.subjectCount >= 2) earned = true;
                    break;
                case 3: // Ocean Defender: 60%+ in Oceans
                    if (context.type === 'QUIZ' && context.subject === 'Oceans' && context.score >= 60) earned = true;
                    break;
                case 4: // Green Genius: 70%+ in any quiz
                    if (context.type === 'QUIZ' && context.score >= 70) earned = true;
                    break;
                case 5: // Habit Hero: 2 unique days
                    if (uniqueDays >= 2) earned = true;
                    break;
                case 6: // Change Maker: 5 unique quizzes
                    // Requiring tracking total unique quizzes
                    if (context.type === 'QUIZ' && context.totalQuizzes >= 5) earned = true;
                    break;
                case 7: // Net Zero Hero: 100% score
                    if (context.type === 'QUIZ' && context.score === 100) earned = true;
                    break;
                case 8: // Nocturnal Nature: After 10 PM
                    const hour = new Date().getHours();
                    if ((context.type === 'QUIZ' || context.type === 'LEARN') && hour >= 22) earned = true;
                    break;
            }

            if (earned) {
                newBadges.push(badge.name);
                user.badges.push(badge.name);
            }
        }

        if (newBadges.length > 0) {
            await user.save();
        }

        return newBadges;
    } catch (error) {
        console.error("Error checking badges:", error);
        return [];
    }
};
