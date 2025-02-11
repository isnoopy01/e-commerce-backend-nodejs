"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AuthService {
  //Sign up
  static signUp = async ({ name, email, password }) => {
    try {
      //Check mail exists
      const checkMailExists = await shopModel.findOne({ email }).lean();
      console.log(checkMailExists);
      if (checkMailExists) {
        return {
          code: "ERR_002",
          message: "Email already exists",
          status: "error",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        console.log("sdsdsds-========");
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
          return {
            code: "ERR_003",
            message: "keyStore not created",
            status: "error",
          };
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
    } catch (error) {
      return {
        code: "ERR_001",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AuthService;
