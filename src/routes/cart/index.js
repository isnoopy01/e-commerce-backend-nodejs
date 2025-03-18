"use strict";
const express = require("express");
const CartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

//Authentication
router.use(authentication);

router.post("", asyncHandler(CartController.addToCart));

module.exports = router;
