
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    co2Saved: {
        type: Number,
        default: 0
    },
    badges: {
        type: [String],
        default: []
    },
    avatar: {
        type: String,
        default: '' // Can be a URL or an identifier like "level_1"
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
