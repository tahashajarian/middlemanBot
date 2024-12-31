const TelegramBot = require('node-telegram-bot-api');
const connectToDb = require('./db/connection');
const config = require('./config/env');
const { handleStart, handleMatch, handleDisconnect } = require('./bot/commands');

(async () => {
    await connectToDb(); // Connect to MongoDB

    const bot = new TelegramBot(config.token, { polling: !config.useWebhook });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const user = { chatId, firstName: msg.from.first_name };

        if (msg.text === '/start') {
            handleStart(bot, chatId);
        } else if (msg.text === '/match') {
            handleMatch(bot, chatId, user);
        } else if (msg.text === '/disconnect') {
            handleDisconnect(bot, chatId);
        }
    });

    console.log('Bot is running...');
})();
