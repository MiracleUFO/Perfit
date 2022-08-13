const express = require('express');
const app = express();
const router = require('./routers/router');
const cors = require('cors');
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './config.env' });

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({limit: '25mb', extended: true}));

app.use('/api/', router);
 
app.listen(port, () => {
  if (db) {
    console.log(`Server is running on port: ${port}`);
  }
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use((req, res, next) => {
  next('404 RouteNotFound. This is the end of the earth.');
});

module.exports = app;