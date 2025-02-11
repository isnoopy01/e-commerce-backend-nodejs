"use strict";
const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./auth"));

// router.post("/v1/api/shop/test", (req, res, next) => {
//   console.log(req.body);
//   return res.status(200).json({ message: "Welcome to the API" });
// });
module.exports = router;
