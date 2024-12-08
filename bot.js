require('dotenv').config(); // Load .env file

const TelegramBot = require('node-telegram-bot-api');

// Check proxy type
const isSocks = process.env.PROXY_TYPE === 'socks';

// Require appropriate proxy library
const agent = isSocks
    ? require('socks5-https-client/lib/Agent') // For SOCKS proxies
    : require('https-proxy-agent');           // For HTTP proxies

// Proxy configuration
const proxyOptions = isSocks
    ? {
          agentClass: agent,
          agentOptions: {
              socksHost: process.env.PROXY_HOST || '127.0.0.1',
              socksPort: parseInt(process.env.PROXY_PORT || '1080'),
          },
      }
    : {
          agent: new agent(`http://${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`),
      };

// Create the bot with proxy
const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true,
    // request: proxyOptions,
});

// Log when the bot starts
console.log(`[BOT] Starting bot...`);
console.log(`[BOT] Proxy: ${process.env.PROXY_TYPE}://${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`);
console.log(`[BOT] Listening for messages...`);

// Handle messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    // Log the received message
    console.log(`[MESSAGE] Received: "${userMessage}" from ${msg.from.username || 'an unknown user'}`);

    // Respond to the user
    bot.sendMessage(chatId, `You said: "${userMessage}"`)
        .then(() => console.log(`[MESSAGE] Replied to ${msg.from.username || 'an unknown user'}`))
        .catch((err) => console.error(`[ERROR] Failed to reply: ${err.message}`));
});

// Log updates (when the bot receives new data)
bot.on('polling_error', (err) => {
    console.error(`[ERROR] Polling error: ${err.message}`);
});

bot.on('webhook_error', (err) => {
    console.error(`[ERROR] Webhook error: ${err.message}`);
});

console.log(`[BOT] Bot is up and running!`);
