"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronics } = require("../models/product.model");

//Define Factory class to create product
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return await new Clothing(payload).createProduct();
      case "Electronics":
        return await new Electronics(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type");
    }
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
}

module.exports = ProductFactory;
