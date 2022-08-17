const mongoose = require('mongoose');
const config = require('../config/mongo');

class Database {
  constructor() {
    this._connect();
  };
  
  _connect() {
    mongoose.connect(config.uri, config._config)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch(err => {
        console.error(`Database connection error: ${err}`);
      });
  };
};

module.exports = new Database();