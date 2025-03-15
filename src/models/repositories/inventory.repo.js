const { inventory } = require("../inventory.model");
const { Types } = require("mongoose");

const insertInventory = async ({
  product_id,
  shop_id,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    product_id,
    shop_id,
    location,
    stock,
  });
};

module.exports = {
  insertInventory,
};
