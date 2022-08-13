const uri = process.env.ATLAS_URI;

let mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect()
  }
  
  _connect() {
    mongoose.connect(uri)
      .then(() => {
        console.log('Database connection successful')
      })
      .catch(err => {
        console.error(`Database connection error: ${err}`)
      })
  }
}

module.exports = new Database()