const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path")
require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 6000;

const db = require("./db/connection");
const seedDatabase = require("./services/seeder");

app.use(express.static(path.join(__dirname, "client", "build")));
app.use(cors());
app.use(express.json());

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
 
app.listen(port, () => {
  if (db) {
    console.log(`Server is running on port: ${port}`);
  }
});

seedDatabase();