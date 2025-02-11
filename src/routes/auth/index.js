"use strict";
const express = require("express");
const authController = require("../../controllers/auth.controller");
const router = express.Router();

//Sign up
router.post("/shop/signup", authController.signUp);

// router.post("/shop/test", (req, res) => {
//   console.log(req.body);
//   return res.status(200).json({ message: "Welcome to the API" });
// });

module.exports = router;
