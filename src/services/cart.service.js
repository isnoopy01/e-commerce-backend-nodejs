"use strict";

const { cart } = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../models/repositories/cart.repo");

/*
    - add product to cart [User]
    - reduce product quantity in cart [User]
    - increase product quantity in cart [User]
    - get cart [User]
    - remove product from cart [User]
    - remove all product from cart [User]
*/

class CartService {
  static async addToCart({ user_id, product = {} }) {
    //Check cart exist
    const userCart = await cart.findOne({ user_id }).lean();
    if (!userCart) {
      return await createUserCart({ user_id, product });
    }
    if (!userCart.products.length) {
      userCart.products = [product];
      return await userCart.save();
    }

    return await updateUserCartQuantity({ user_id, product });
  }

  /*
    update cart
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
}

module.exports = CartService;
