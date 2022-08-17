const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const db = require('./services/dbConnection');
require('dotenv').config({ path: './config.env' });

app.use(cors());
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({ extended: true }));

//  Port
const port = process.env.PORT || 8080;

//  Routers
const usersRoutes = require('./routes/usersRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');

//  Base paths
app.use('/api/users', usersRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
 
app.listen(port, () => {
  if (db) console.log(`Server is running on port: ${port}`);
});

//  Serve client side
if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging'
) {
  app.use(express.static(path.join(__dirname, '../', 'client', 'build')));

  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
  });
}


app.use((req, res, next) => {
  next('404RouteNotFound. You\'re falling off the earth 😵‍💫.');
});

module.exports = app;