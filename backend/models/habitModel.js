import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    type: { type: String, default: 'daily' },
    startTime: { type: String },
    endTime: { type: String },
    streak: { type: Number, default: 0 },
    mode: { type: String, default: '21-day' },
    lastCompleted: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
}, { minimize: false });

const habitModel = mongoose.models.habit || mongoose.model('habit', habitSchema);

export default habitModel;