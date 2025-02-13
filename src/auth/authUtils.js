"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const {
  AuthFailureError,
  NotFoundError,
  BadRequestError,
} = require("../core/error.response");
const { findByUserId } = require("../services/keytoken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log(`Error Verify ::`, err);
      } else {
        console.log(`Decode :: `, decoded);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  //Check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError("Invalid Request");

  //Get accessToken
  const keyStore = await findByUserId(userId);

  if (!keyStore) throw new NotFoundError("KeyStore not found");
  //Verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  //Check user in DB
  //Check keystore with userId
  //Return next
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Request");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw new BadRequestError(error.message);
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
