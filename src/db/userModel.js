const mongoose = require('mongoose');
const { user_status_enum } = require('../consts');

const userSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    matchedWith: { type: String, default: null }, // Chat ID of matched user
    status: { type: String, enum: [user_status_enum.available, user_status_enum.matched, user_status_enum.idle], default: user_status_enum.idle },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
