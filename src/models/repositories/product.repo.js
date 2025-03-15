"use strict";

const { getSelectData, unGetSelectData } = require("../../utils");
const { product, electronics, clothing } = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      { is_published: true, $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};

const publishProductForShop = async ({ shop, id }) => {
  const foundShop = await product.findOne({
    shop: new Types.ObjectId(shop),
    _id: new Types.ObjectId(id),
  });
  if (!foundShop) return null;
  foundShop.is_draft = false;
  foundShop.is_published = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductForShop = async ({ shop, id }) => {
  const foundShop = await product.findOne({
    shop: new Types.ObjectId(shop),
    _id: new Types.ObjectId(id),
  });
  if (!foundShop) return null;
  foundShop.is_draft = true;
  foundShop.is_published = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ id, unSelect }) => {
  const products = await product
    .findById(id)
    .select(unGetSelectData(unSelect))
    .lean();

  return products;
};

const updateProductById = async ({ id, bodyUpdate, model, isNew = true }) => {
  return await model.findByIdAndUpdate(id, bodyUpdate, { new: isNew });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftForShop,
  publishProductForShop,
  findAllPublishForShop,
  unPublishProductForShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
