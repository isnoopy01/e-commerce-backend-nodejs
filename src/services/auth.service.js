"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError } = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AuthService {
  //Sign up
  static signUp = async ({ name, email, password }) => {
    const checkMailExists = await shopModel.findOne({ email }).lean();
    console.log(checkMailExists);
    if (checkMailExists) {
      throw new BadRequestError("Error: Shop already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      //Created privateKey, publicKey
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      console.log(publicKey);
      console.log(privateKey);
      // console.log({ privateKey, publicKey });

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: KeyStore not created");
      }

      // create token pair
      const token = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Created Token Pair :: `, token);

      return {
        code: "ERR_000",
        metadata: {
          shop: newShop,
          token,
        },
      };
    }

    return {
      code: "ERR_004",
      metadata: null,
    };
  };
}

module.exports = AuthService;
