"use strict";
const express = require("express");
const discountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

//Authentication
router.use(authentication);

router.post("", asyncHandler(discountController.createDiscountCode));

module.exports = router;
