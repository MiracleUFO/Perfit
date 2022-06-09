const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path")
require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 6000;

const dbo = require("./db/connection");

app.use(express.static(path.join(__dirname, "client", "build")));
app.use(cors());
app.use(express.json());

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
 
app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err); 
  });
  console.log(`Server is running on port: ${port}`);
});