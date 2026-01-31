
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctOptionIndex: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        default: 'General'
    }
});

export default mongoose.model('Question', questionSchema);
