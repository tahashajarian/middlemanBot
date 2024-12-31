require('dotenv').config();

module.exports = {
    token: process.env.BOT_TOKEN,
    useWebhook: process.env.USE_WEBHOOK === 'true',
    webhookUrl: process.env.WEBHOOK_URL,
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI,
};
