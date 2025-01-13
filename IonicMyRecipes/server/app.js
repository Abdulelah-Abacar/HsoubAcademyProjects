require("dotenv").config();
const express = require("express");
const router = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./models/database");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("*/images", express.static(__dirname + "/public/images"));

app.use("/", router);

db.sync({ force: true }).then(() => {
  app.listen(port, () => {
    console.log("Server started on port " + port);
  });
});
