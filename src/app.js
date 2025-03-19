const compression = require("compression");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

require("dotenv").config();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init DB
require("./database/init.mongodb");

const initRedis = require("./database/init.redis");
initRedis.initRedis();
// const { checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();
//init routes
app.use("/", require("./routes"));
//handle errors

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    error: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
