"use strict";

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
  deleteUserCart,
  getListUserCart,
} = require("../models/repositories/cart.repo");
const { findProduct } = require("../models/repositories/product.repo");

/*
    - add product to cart [User]
    - reduce product quantity in cart [User]
    - increase product quantity in cart [User]
    - get cart [User]
    - remove product from cart [User]
    - remove all product from cart [User]
*/

class CartService {
  /*
    shop_order_ids: [
        {
            shop_id,
            item_products: [
                {
                    quantity,
                    price,
                    shop_id,
                    old_quantity,
                    product_id
                }
            ],
            version
        }
    ]
  */
  static async addToCart({ user_id, product = {} }) {
    const { product_id, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    //Check product
    const foundProduct = await findProduct({ id: product_id });
    if (!foundProduct) throw new NotFoundError("Product not found");
    if (foundProduct.shop.toString() !== shop_order_ids[0]?.shop_id) {
      throw new NotFoundError("Shop not found");
    }
    if (quantity === 0) {
      //delete
    }

    return await updateUserCartQuantity({
      user_id,
      product: {
        product_id,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteCart({ user_id, product_id }) {
    return await deleteUserCart({ user_id, product_id });
  }

  static async getCart({ user_id }) {
    return await getListUserCart({ user_id });
  }
}

module.exports = CartService;
