"use strict";

const AuthService = require("../services/auth.service");

class AuthController {
  //Sign up
  signUp = async (req, res, next) => {
    console.log(req.body.name);
    try {
      console.log(`[P]::signUp::`, req.body);
      return res.status(201).json(await AuthService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
