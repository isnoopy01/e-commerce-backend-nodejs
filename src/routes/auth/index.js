"use strict";
const express = require("express");
const authController = require("../../controllers/auth.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

const router = express.Router();

//Sign up
router.post("/shop/signup", asyncHandler(authController.signUp));
//Login
router.post("/shop/login", asyncHandler(authController.login));

//Authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(authController.logout));
router.post(
  "/shop/refresh-token",
  asyncHandler(authController.handlerRefreshToken)
);

// router.post("/shop/test", (req, res) => {
//   console.log(req.body);
//   return res.status(200).json({ message: "Welcome to the API" });
// });

module.exports = router;
