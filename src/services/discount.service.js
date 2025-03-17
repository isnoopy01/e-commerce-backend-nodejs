"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const { convertToObjectIdMongoDb } = require("../utils");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("../models/repositories/discount.repo");
/**
 Discount service
 1. Generator Discount Code [Shop|Admin]
 2. Get discount amount [User]
 3. Get all discount code [User|Shop]
 4. Verify discount code [User]
 5. Delete discount code [Shop|Admin]
 6. Cancel discount code [User]
 */

class discountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shop_id,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_uses,
      max_uses_per_user,
      users_used,
      uses_count,
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Start date must be greater than current date");
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("End date must be greater than start date");
    }

    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        code,
        shop_id: convertToObjectIdMongoDb(shop_id),
      },
    });

    if (foundDiscount && foundDiscount.is_active) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await discount.create({
      name,
      description,
      type,
      code,
      value,
      min_order_value,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      shop_id,
      max_uses_per_user,
      is_active,
      applies_to,
      product_ids: applies_to == "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {}

  static async getAllDiscountCodesWithProduct({
    code,
    shop_id,
    user_id,
    limit,
    page,
  }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        code,
        shop_id: convertToObjectIdMongoDb(shop_id),
      },
    });

    if (!foundDiscount || !foundDiscount.is_active) {
      throw new BadRequestError("Discount code not exists");
    }

    const { applies_to, product_ids } = foundDiscount;
    let products;
    if (applies_to === "all") {
      products = await findAllProducts({
        filter: {
          shop: convertToObjectIdMongoDb(shop_id),
          is_published: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["name"],
      });
    }
    if (applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: product_ids },
          is_published: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["name"],
      });
    }
    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shop_id }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        shop_id: convertToObjectIdMongoDb(shop_id),
        is_active: true,
      },
      unSelect: ["__v", "shop_id"],
      model: discount,
    });

    return discounts;
  }

  static async getDiscountAmount({ code, user_id, shop_id, products }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        code,
        shop_id: convertToObjectIdMongoDb(shop_id),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount code not found");

    const {
      is_active,
      max_uses,
      start_date,
      end_date,
      min_order_value,
      max_uses_per_user,
      users_used,
      type,
      value,
    } = foundDiscount;

    if (!is_active) throw new BadRequestError("Discount code is not active");
    if (!max_uses) throw new BadRequestError("Discount code has been used up");
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
      throw new BadRequestError("Discount code has expired");

    let totalOrder = 0;
    if (min_order_value > 0) {
      totalOrder = products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);

      if (totalOrder < min_order_value) {
        throw new BadRequestError(
          "Order value is less than minimum order value"
        );
      }
    }

    if (max_uses_per_user > 0) {
      const userUseDiscount = users_used.find(
        (user) => user.user_id === user_id
      );
      if (userUseDiscount) {
        if (userUseDiscount.uses >= max_uses_per_user) {
          throw new BadRequestError("Discount code has been used up");
        }
      }
    }

    const amount = type === "fixed_amount" ? value : (totalOrder * value) / 100;

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ code, shop_id }) {
    //Tim discount code neu co thi xoa
    const deleted = await discount.findOneAndDelete({
      code,
      shop_id: convertToObjectIdMongoDb(shop_id),
    });
    return deleted;
  }

  static async cancelDiscountCode({ code, user_id, shop_id }) {
    const foundDiscount = await checkDiscountExist({
      model: discount,
      filter: {
        code,
        shop_id: convertToObjectIdMongoDb(shop_id),
      },
    });
    if (!foundDiscount) throw new NotFoundError("Discount code not found");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        users_used: user_id,
      },
      $inc: {
        max_uses: 1,
        uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = discountService;
