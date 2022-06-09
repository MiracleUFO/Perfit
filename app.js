const express = require('express');
const app = express();
const router = require('./routers/router');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const port = process.env.PORT || 8080;
const db = require('./db/connection');

// app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(cors());
app.use(express.json());

app.use('/api/', router);

/* app.use((req, res, next) => {
    next('404 RouteNotFound. This is the end of the earth');
});


/* app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
}); */
 
app.listen(port, () => {
  if (db) {
    console.log(`Server is running on port: ${port}`);
  }
});

module.exports = app;