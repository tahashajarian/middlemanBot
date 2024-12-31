const mongoose = require('mongoose');
const config = require('../config/env');

const connectToDb = async () => {
    try {
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit if connection fails
    }
};

module.exports = connectToDb;
