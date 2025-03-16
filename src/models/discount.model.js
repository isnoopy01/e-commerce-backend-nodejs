"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "fixed_amount", //percentage
      enum: ["fixed_amount", "percentage"],
    },
    value: {
      type: Number,
      required: true,
    },
    max_value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    max_uses: {
      type: Number,
      required: true,
    }, // so luong discount duoc ap dung
    uses_count: {
      type: Number,
      required: true,
    }, //So luong discount da su dung
    users_used: {
      type: Array,
      default: [],
    }, //Danh sach user da su dung discount
    max_uses_per_user: {
      type: Number,
      required: true,
    }, // so luong discount duoc ap dung cho 1 user
    min_order_value: {
      type: Number,
      required: true,
    },
    shop_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    product_ids: {
      type: Array,
      default: [],
    }, //Danh sach san pham duoc ap dung neu applies_to = specific
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};
