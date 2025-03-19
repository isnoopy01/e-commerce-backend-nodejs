const { convertToObjectIdMongoDb } = require("../../utils");
const { inventory } = require("../inventory.model");

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

const reservationInventory = async ({ product_id, quantity, cart_id }) => {
  const query = {
    product_id: convertToObjectIdMongoDb(product_id),
    stock: { $gte: quantity },
  };
  const updateSet = {
    $set: {
      stock: -quantity,
    },
    $push: {
      reservations: {
        quantity,
        cart_id,
        createdAr: new Date(),
      },
    },
  };
  const options = { upsert: true, new: true };
  return await inventory.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
