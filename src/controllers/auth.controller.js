"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AuthService = require("../services/auth.service");

class AuthController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token successfully",
      metadata: await AuthService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AuthService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login successfully",
      metadata: await AuthService.login(req.body),
    }).send(res);
  };
  //Sign up
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register successfully",
      metadata: await AuthService.signUp(req.body),
    }).send(res);
    // return res.status(201).json(await AuthService.signUp(req.body));
  };
}

module.exports = new AuthController();
