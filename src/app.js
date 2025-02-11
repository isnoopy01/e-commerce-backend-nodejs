const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

require("dotenv").config();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init DB
require("./database/init.mongodb");
// const { checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();
//init routes
app.use("/", require("./routes"));
//handle errors

module.exports = app;
