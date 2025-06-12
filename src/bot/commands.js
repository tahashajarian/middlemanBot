const { user_status_enum } = require("../consts");
const { addUserToQueue, matchUsers, removeMatch } = require("./matchmaker");
const { pauseUser } = require("./matchmaker");
const keyboards = require("./keyboards");

const handleStart = async (bot, chatId) => {
  bot.sendMessage(
    chatId,
    "Welcome to the matchmaking bot! Type /match to find a partner.",
    keyboards[user_status_enum.idle]
  );
};

const handleMatch = async (bot, chatId, user) => {
  await addUserToQueue({ ...user, status: user_status_enum.available });
  const match = await matchUsers();
  if (match) {
    bot.sendMessage(
      match.user1.chatId,
      `You are connected with ${match.user2.firstName}`,
      keyboards[user_status_enum.matched]
    );
    bot.sendMessage(
      match.user2.chatId,
      `You are connected with ${match.user1.firstName}`,
      keyboards[user_status_enum.matched]
    );
  } else {
    bot.sendMessage(
      chatId,
      "Waiting for a match...",
      keyboards[user_status_enum.available]
    );
  }
};

const handleDisconnect = async (bot, chatId) => {
  const disconnectedUsers = await removeMatch(chatId);

  disconnectedUsers.forEach((id) => {
    bot.sendMessage(
      id,
      "You have been disconnected from your match.",
      keyboards[user_status_enum.idle]
    );
  });
};

const handlePause = async (bot, chatId) => {
  const success = await pauseUser(chatId);
  if (success) {
    bot.sendMessage(
      chatId,
      "You are now paused. You won’t be matched with anyone.",
      keyboards[user_status_enum.idle]
    );
  } else {
    bot.sendMessage(chatId, "Could not pause your status.");
  }
};

module.exports = { handleStart, handleMatch, handleDisconnect, handlePause };
