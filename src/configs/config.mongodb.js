"use strict";

const development = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_DATABASE || "mongodb",
  },
};

const production = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_DATABASE || "mongodb",
  },
};

const config = { development, production };
const env = process.env.NODE_ENV || "development";

module.exports = config[env];
