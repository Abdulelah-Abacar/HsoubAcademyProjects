const express = require('express');
const cors = require("cors");
const expressValidator = require("express-validator");

const router = require("./routes");

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// validate
app.use(expressValidator())

app.use("/", router);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err)
});
app.use((err, req, res, next) => {
  res.status(err.status||500);
  res.json({message: err.message});
});

module.exports = app;