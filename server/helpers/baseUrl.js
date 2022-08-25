const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../', 'config.env')});

const baseUrl = () => {
    const url = process.env.NODE_ENV !== 'development' ? 'http://perfit-web.herokuapp.com' : 'http://localhost:8080';
    return url;
};

module.exports = baseUrl;