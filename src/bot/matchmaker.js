const User = require('../db/userModel');

// Add user to matchmaking queue
const addUserToQueue = async (user) => {
    const existingUser = await User.findOne({ chatId: user.chatId });
    if (!existingUser) {
        return await User.create({ chatId: user.chatId, firstName: user.firstName });
    }
    existingUser.status = 'available';
    existingUser.matchedWith = null;
    return await existingUser.save();
};

// Match users
const matchUsers = async () => {
    const users = await User.find({ status: 'available' }).limit(2);
    if (users.length === 2) {
        const [user1, user2] = users;
        user1.status = 'matched';
        user2.status = 'matched';
        user1.matchedWith = user2.chatId;
        user2.matchedWith = user1.chatId;
        await user1.save();
        await user2.save();
        return { user1, user2 };
    }
    return null;
};

// Remove match
const removeMatch = async (chatId) => {
    const user = await User.findOne({ chatId });
    if (user && user.matchedWith) {
        const matchedUser = await User.findOne({ chatId: user.matchedWith });
        user.status = 'available';
        user.matchedWith = null;
        matchedUser.status = 'available';
        matchedUser.matchedWith = null;
        await user.save();
        await matchedUser.save();
    }
};

module.exports = { addUserToQueue, matchUsers, removeMatch };
