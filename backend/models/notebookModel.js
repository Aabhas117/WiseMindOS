import mongoose from 'mongoose';

const notebookSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
}, { minimize: false });

const notebookModel = mongoose.models.notebook || mongoose.model('notebook', notebookSchema);

export default notebookModel;