"use strict";
const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

//Check API key
router.use(apiKey);
//Check permission
router.use(permission("0000"));
//Router API
router.use("/v1/api", require("./auth"));

module.exports = router;
