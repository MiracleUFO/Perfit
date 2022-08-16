const express = require('express');
const app = express();
const config = {};

const mongoURI =
{
    development: 'mongodb://localhost:27017/perfit',
    production: process.env.ATLAS_URI
};

config.uri = mongoURI[app.settings.env];

config._config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports = config;