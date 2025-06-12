const TelegramBot = require("node-telegram-bot-api");
const connectToDb = require("./db/connection");
const config = require("./config/env");
const {
  handleStart,
  handleMatch,
  handleDisconnect,
} = require("./bot/commands");
const { handleChatMessage } = require("./bot/handleChatMessage");

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

    if (text === "/start") {
      await handleStart(bot, chatId);
    } else if (text === "/match") {
      await handleMatch(bot, chatId, user);
    } else if (text === "/disconnect") {
      await handleDisconnect(bot, chatId);
    } else {
      // Forward messages to the matched user
      await handleChatMessage(bot, chatId, text);
    }
  });

  console.log("Bot is running...");
})();
