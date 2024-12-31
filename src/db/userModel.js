const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    matchedWith: { type: String, default: null }, // Chat ID of matched user
    status: { type: String, enum: ['available', 'matched'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
