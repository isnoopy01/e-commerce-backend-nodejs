"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const OrderSchema = new Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    checkout: {
      type: Object,
      default: {},
    },
    /*
        order_checkout = {
            total_price: 0,
            total_apply_discount: 0,
            fee_ship: 0,
        }
    */
    shipping: {
      type: Object,
      default: {},
    },
    /*
        street,
        city,
        state,
        country,
    */
    payment: {
      type: Object,
      default: {},
    },
    products: {
      type: Array,
      required: true,
      default: [],
    },
    tracking_number: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "cancelled",
        "delivered",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  order: model(DOCUMENT_NAME, OrderSchema),
};
