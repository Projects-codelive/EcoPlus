
import express from 'express';
import Question from '../models/Question.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/quiz/random - Get 5 random questions
router.get('/random', async (req, res) => {
    try {
        const questions = await Question.aggregate([{ $sample: { size: 5 } }]);
        // Remove correctOptionIndex from response to prevent cheating
        const safeQuestions = questions.map(q => ({
            id: q._id,
            question: q.questionText,
            options: q.options
        }));
        res.json(safeQuestions);
    } catch (error) {
        console.error("Quiz Fetch Error:", error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

// POST /api/quiz/verify - Verify answer and update points
// POST /api/quiz/verify - Verify answer and update points
router.post('/verify', async (req, res) => {
    try {
        const { userId, questionId, selectedOptionIndex } = req.body;

        // 1. Validate Input existence
        if (!questionId || selectedOptionIndex === undefined) {
            return res.status(400).json({ message: 'Missing questionId or selectedOptionIndex' });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // 2. ROBUST COMPARISON LOGIC
        // Convert both to integers to ensure we are comparing numbers to numbers
        const dbIndex = parseInt(question.correctOptionIndex, 10);
        const userIndex = parseInt(selectedOptionIndex, 10);

        // Check if the user sent a valid number
        if (isNaN(userIndex)) {
             return res.status(400).json({ message: 'Invalid index format provided' });
        }

        const isCorrect = dbIndex === userIndex;

        // Debugging Logs (Remove these in production)
        console.log(`--- Verification Debug ---`);
        console.log(`Question: "${question.questionText}"`);
        console.log(`DB says Correct Index is: ${dbIndex} (Option: ${question.options[dbIndex]})`);
        console.log(`User selected Index: ${userIndex} (Option: ${question.options[userIndex]})`);
        console.log(`Match Result: ${isCorrect}`);
        console.log(`--------------------------`);

        let newPoints = 0;
        if (isCorrect && userId) {
            const user = await User.findByIdAndUpdate(
                userId,
                { $inc: { points: 20 } },
                { new: true }
            );
            newPoints = user ? user.points : 0;
        }

        res.json({
            success: isCorrect,
            newTotalPoints: newPoints,
            correctOptionIndex: dbIndex, // Send back the correct index so frontend can show it
            correctOptionText: question.options[dbIndex] // Optional: Send back the text too
        });

    } catch (error) {
        console.error("Quiz Verify Error:", error);
        res.status(500).json({ message: 'Error verifying answer' });
    }
});

export default router;
