"use strict";

const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product successfully",
      metadata: await ProductService.createProduct(req.body.type, {
        ...req.body,
        shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product successfully",
      metadata: await ProductService.updateProduct(
        req.body.type,
        req.params.id,
        {
          ...req.body,
          shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product successfully",
      metadata: await ProductService.publishProductForShop({
        shop: req.user.userId,
        id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish product successfully",
      metadata: await ProductService.unPublishProductForShop({
        shop: req.user.userId,
        id: req.params.id,
      }),
    }).send(res);
  };

  /**
   * @desc Get all draft products for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all draft products successfully",
      metadata: await ProductService.findAllDraftForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all publish products successfully",
      metadata: await ProductService.findAllPublishForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list products successfully",
      metadata: await ProductService.searchProduct(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get find all products successfully",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get find products successfully",
      metadata: await ProductService.findProduct({ id: req.params.id }),
    }).send(res);
  };
}

module.exports = new ProductController();
