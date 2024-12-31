require('dotenv').config(); // Load .env file

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const useWebhook = process.env.USE_WEBHOOK === 'true'; // Read webhook setting from .env

// Create a bot that uses either 'polling' or 'webhook'
const bot = new TelegramBot(token, { polling: !useWebhook });

// Function to handle messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)
    if (msg.text === '/start') {
        bot.sendMessage(chatId, 'Welcome to the dynamic bot!');
    } else {
        bot.sendMessage(chatId, 'You said: ' + msg.text);
    }
});

if (useWebhook) {
    const url = process.env.WEBHOOK_URL; // Define webhook URL in .env
    const port = process.env.PORT || 5000; // Define port for webhook (default 3000)

    // Set webhook
    bot.setWebHook(`${url}/bot${token}`);

    // Handle incoming webhook requests
    const express = require('express');
    const app = express();
    app.use(express.json());
    
    app.post(`/bot${token}`, (req, res) => {
        const update = req.body;
        bot.processUpdate(update);
        res.sendStatus(200);
    });

    app.listen(port, () => {
        console.log(`Webhook is set up at ${url}/bot${token}`);
    });
} else {
    console.log('Bot is running with polling...');
}
