"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { findProduct } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory(
    stock,
    product_id,
    shop_id,
    location = "Ha Noi"
  ) {
    const product = await findProduct({ id: product_id });
    if (!product) throw new NotFoundError("Product not found");
    const query = { shop_id, product_id };
    const updateSet = {
      $inc: {
        stock,
      },
      $set: {
        location,
      },
    };
    const options = { updateSet: true, new: true };
    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
