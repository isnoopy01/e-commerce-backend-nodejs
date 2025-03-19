"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    location: {
      type: String,
      default: "unknown",
    },
    stock: {
      type: Number,
      required: true,
    },
    shop_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      unique: true,
    },
    //Đặt hàng trước. Khi sản phẩm được thêm vào giỏ hàng thì sẽ thêm vào đây
    reservation: {
      type: Array,
      default: [],
    },
    /*
      cart_id,
      stock,
      createdAt
    */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
