"use strict";
const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

//Check API key
router.use(apiKey);
//Check permission
router.use(permission("0000"));
//Router API
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api", require("./auth"));

module.exports = router;
