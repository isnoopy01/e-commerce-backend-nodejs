"use strict";

const redis = require("redis");
const { RedisResponseError } = require("../core/error.response");

let client = {},
  connectionTimeout;
const statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error",
};

const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: "Redis connect timeout",
};

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisResponseError({
      message: REDIS_CONNECT_MESSAGE.message,
      statusCode: REDIS_CONNECT_MESSAGE.code,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("Redis connected");
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("Redis end");
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("Redis reconnecting");
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, () => {
    console.log("Redis error");
    handleTimeoutError();
  });
};
const initRedis = () => {
  const instanceRedis = redis.createClient();
  instanceRedis.connect();
  client.instanceConnect = instanceRedis;
  handleEventConnection({ connectionRedis: instanceRedis });
};

const getRedis = () => client;

const closeRedis = () => {};

module.exports = { initRedis, getRedis, closeRedis };
