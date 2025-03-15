"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronics } = require("../models/product.model");
const {
  findAllDraftForShop,
  publishProductForShop,
  findAllPublishForShop,
  unPublishProductForShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

//Define Factory class to create product
class ProductFactory {
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid product type");

    return new productClass(payload).updateProduct(id);
  }

  static async publishProductForShop({ shop, id }) {
    return await publishProductForShop({ shop, id });
  }

  static async unPublishProductForShop({ shop, id }) {
    return await unPublishProductForShop({ shop, id });
  }

  static async findAllDraftForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, is_draft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, is_published: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { is_published: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["name", "price", "thumbnail"],
    });
  }

  static async findProduct({ id }) {
    return await findProduct({ id, unSelect: ["__v"] });
  }
}

//Define base product class
class Product {
  constructor({
    name,
    thumbnail,
    description,
    price,
    quantity,
    type,
    shop,
    attributes,
  }) {
    this.name = name;
    this.thumbnail = thumbnail;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shop = shop;
    this.attributes = attributes;
  }

  async createProduct(id) {
    return await product.create({ ...this, _id: id });
  }

  async updateProduct(id, bodyUpdate) {
    return await updateProductById({ id, bodyUpdate, model: product });
  }
}

//Define sub-class for different product type Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newClothing) throw new BadRequestError("Create new Clothing error");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }

  async updateProduct(id) {
    const updateNest = updateNestedObjectParser(this);
    //Remove attribute has null or undefined value
    const objectParams = removeUndefinedObject(updateNest);
    //Check update product
    if (objectParams.attributes) {
      await updateProductById({ id, objectParams, model: clothing });
    }
    const updateProduct = await super.updateProduct(id, objectParams);
    return updateProduct;
  }
}

//Define sub-class for different product type Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newElectronics)
      throw new BadRequestError("Create new Electronics error");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError("Create new Product error");

    return newProduct;
  }

  async updateProduct(id) {
    //Remove attribute has null or undefined value
    const objectParams = removeUndefinedObject(this);
    //Check update product
    if (objectParams.attributes) {
      await updateProductById({ id, objectParams, model: electronics });
    }
    const updateProduct = await super.updateProduct(id, objectParams);
    return updateProduct;
  }
}

//Register product type
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);

module.exports = ProductFactory;
