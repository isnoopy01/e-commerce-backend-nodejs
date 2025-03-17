const { cart } = require("../cart.model");

const createUserCart = async ({ user_id, product }) => {
  const query = { user_id, state: "active" };
  const updateOrInsert = {
    $addToSet: {
      products: product,
    },
  };
  const options = { upsert: true, new: true };
  return await cart.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ user_id, product }) => {
  const { product_id, quantity } = product;
  const query = { user_id, "products.product_id": product_id, state: "active" };
  const updateSet = {
    $inc: {
      "products.$.quantity": quantity,
    },
  };
  const options = { upsert: true, new: true };
  return await cart.findOneAndUpdate(query, updateSet, options);
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
};
