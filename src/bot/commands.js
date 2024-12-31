const { addUserToQueue, matchUsers, removeMatch } = require('./matchmaker');

const handleStart = async (bot, chatId) => {
    bot.sendMessage(chatId, 'Welcome to the matchmaking bot! Type /match to find a partner.');
};

const handleMatch = async (bot, chatId, user) => {
    await addUserToQueue(user);
    const match = await matchUsers();
    if (match) {
        bot.sendMessage(match.user1.chatId, `You are connected with ${match.user2.firstName}`);
        bot.sendMessage(match.user2.chatId, `You are connected with ${match.user1.firstName}`);
    } else {
        bot.sendMessage(chatId, 'Waiting for a match...');
    }
};

const handleDisconnect = async (bot, chatId) => {
    await removeMatch(chatId);
    bot.sendMessage(chatId, 'You have been disconnected from your match.');
};

module.exports = { handleStart, handleMatch, handleDisconnect };
