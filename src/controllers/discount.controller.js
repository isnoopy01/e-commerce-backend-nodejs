"use strict";

const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require("../core/success.response");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    return new SuccessResponse({
      message: "Discount code created",
      metadata: DiscountService.createDiscountCode({
        ...req.body,
        shop_id: req.user.user_id,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    return new SuccessResponse({
      message: "All discount codes",
      metadata: DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shop_id: req.user.user_id,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    return new SuccessResponse({
      message: "Discount amount",
      metadata: DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProducts = async (req, res, next) => {
    return new SuccessResponse({
      message: "All discount codes with products",
      metadata: DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
