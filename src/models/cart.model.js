"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema(
  {
    state: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "completed", "failed", "pending"],
    },
    products: {
      type: Array,
      required: true,
      default: [],
    },
    count_product: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
