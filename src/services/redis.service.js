"use strict";

const redis = require("redis");
const { promisify } = require("util");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const { getRedis } = require("../database/init.redis");

const { instanceConnect: redisClient } = getRedis();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (product_id, quantity, cart_id) => {
  const keyLock = `lock_v2025_${product_id}`;
  const retry = 10;
  const expireTime = 3000;
  for (let i = 0; i < retry; i++) {
    const result = await setnxAsync(keyLock, expireTime);
    if (result) {
      //Thao tac voi inventory
      const isReservation = await reservationInventory({
        product_id,
        quantity,
        cart_id,
      });
      if (isReservation.modifiedCount) {
        await pexpire(keyLock, expireTime);
        return keyLock;
      }
      return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
