const { user_status_enum } = require('../consts');
const User = require('../db/userModel');
const keyboards = require('./keyboards');

const handleChatMessage = async (bot, chatId, text) => {
  const user = await User.findOne({ chatId });
  if (user && user.status === 'matched' && user.matchedWith) {
    const matchedUser = await User.findOne({ chatId: user.matchedWith });
    if (matchedUser) {
      bot.sendMessage(matchedUser.chatId, `Message from ${user.firstName}: ${text}`);
    } else {
      bot.sendMessage(chatId, 'Your match is no longer available.');
    }
  } else {
    bot.sendMessage(chatId, 'You are not currently matched with anyone. Use /match to find a partner.', keyboards[user_status_enum.idle]);
  }
};

module.exports = { handleChatMessage };
