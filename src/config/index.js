const path = require('path');

const config = {};

require('dotenv').config({
    path: path.join(__dirname, '.env').normalize(),
});

config.env = process.env.NODE_ENV || 'development';
config.port = parseInt(process.env.PORT, 10) || 3000;
config.mongodbUri = process.env.MONGODB_URI;

module.exports = config;
