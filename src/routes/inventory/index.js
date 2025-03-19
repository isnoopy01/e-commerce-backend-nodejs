"use strict";
const express = require("express");

const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const InventoryController = require("../../controllers/inventory.controller");

const router = express.Router();

//Authentication
router.use(authentication);

router.post("", asyncHandler(InventoryController.addStockToInventory));

module.exports = router;
