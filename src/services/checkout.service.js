"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /**
     {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discount: [
                    {
                        shop_id,
                        discount_id,
                        code,
                    }
                ],
                item_products: [
                    price,
                    quantity,
                    product_id
                ]
            }
        ]
     }
     */
  static async checkoutReview({ cart_id, user_id, shop_order_ids }) {
    // Check cart co ton tai khong
    const foundCart = await findCartById({ cart_id });
    if (!foundCart) throw new NotFoundError("Cart not found");

    const checkout_order = {
      total_price: 0,
      fee_ship: 0,
      total_discount: 0,
      total_checkout: 0,
    };
    const shop_order_ids_new = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shop_id,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductServer = await checkProductByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong");

      const checkoutPrice = checkProductServer.reduce((total, product) => {
        return total + product.price * product.quantity;
      });

      //Tong tien trc khi xu ly
      checkout_order.total_price += checkoutPrice;

      const itemCheckout = {
        shop_id,
        shop_discounts,
        price_raw: checkoutPrice,
        price_apply_discount: checkoutPrice,
        item_products: checkProductServer,
      };
      if (shop_discounts.length) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          code: shop_discounts[0].code,
          user_id,
          shop_id,
          products: checkProductServer,
        });

        checkout_order.total_discount += discount;
        if (discount) {
          itemCheckout.price_apply_discount = checkoutPrice - discount;
        }
      }

      checkout_order.total_checkout += itemCheckout.price_apply_discount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cart_id,
    user_id,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cart_id,
        user_id,
        shop_order_ids,
      });
    //Check lai 1 lan nua xem vuot ton kho hay khong
    // get new array Products
    const acquireProduct = [];
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    for (let i = 0; i < products.length; i++) {
      const { product_id, quantity } = products[i];
      const keyLock = await acquireLock(product_id, quantity, cart_id);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError("Product out of stock");
    }

    const newOrder = await order.create({
      user_id,
      checkout: checkout_order,
      shipping: user_address,
      payment: user_payment,
      products: shop_order_ids_new,
    });
    //Neu tao thanh cong, remove product trong cart
    if (newOrder) {
      //Remove product trong cart
    }
    return newOrder;
  }
  //Query order [User]
  static async getOrderByUser() {}

  //Query order using ID [User]
  static async getOneOrderByUser() {}

  //Cancel order [User]
  static async cancelOrderByUser() {}

  //Update Order Status [Admin|Shop]
  static async updateOrderStatusByShop() {}
}

module.exports = new CheckoutService();
