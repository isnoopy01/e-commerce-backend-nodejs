"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
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
        //Created privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        console.log({ privateKey, publicKey });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "ERR_003",
            message: "Publickey not created",
            status: "error",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log(`Public Key Object :: `, publicKeyObject);

        // create token pair
        const token = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
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
