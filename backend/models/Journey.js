import mongoose from 'mongoose';

const journeySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transportType: {
        type: String,
        enum: ['bicycle', 'train', 'bus', 'electric', 'car'],
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    fuelEfficiency: {
        type: Number // Only for car
    },
    emissions: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Journey', journeySchema);
