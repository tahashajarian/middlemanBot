const TelegramBot = require("node-telegram-bot-api");
const connectToDb = require("./db/connection");
const config = require("./config/env");
const {
  handleStart,
  handleMatch,
  handleDisconnect,
  handlePause,
} = require("./bot/commands");
const { handleChatMessage } = require("./bot/handleChatMessage");
const { commands_enum } = require("./consts");

(async () => {
  await connectToDb(); // Connect to MongoDB

  const bot = new TelegramBot(config.token, { polling: !config.useWebhook });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const user = { chatId, firstName: msg.from.first_name };
    const text = msg.text;

    console.log(
      `Received a message from ${user.firstName} (${chatId}): ${text}`
    );

    if (text === commands_enum.start) {
      await handleStart(bot, chatId);
    } else if (text === commands_enum.match) {
      await handleMatch(bot, chatId, user);
    } else if (text === commands_enum.disconnect) {
      await handleDisconnect(bot, chatId);
    } else if (text === commands_enum.pause) {
      await handlePause(bot, chatId);
    } else {
      // Forward messages to the matched user
      await handleChatMessage(bot, chatId, text);
    }
  });

  console.log("Bot is running...");
})();
