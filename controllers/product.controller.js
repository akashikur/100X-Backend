const Joi = require("joi");
const Product = require("../modules/Product");

const createProduct = async (req, res) => {
  const isValid = Joi.object({
    productname: Joi.string().required(),
    productDetails: Joi.string().required(),
  }).validate(req.body);
  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid Input",
    });
  }

  const { productname, productDetails } = req.body;
  const productObj = new Product({
    productname,
    productDetails,
    creationTime: new Date(),
    createdBy: req.locals.username,
    adminId: req.locals.userId,
  });
  try {
    await productObj.save();

    return res.status(201).send({
      status: 201,
      message: "Product created successfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Failed to create Product",
      data: error,
    });
  }
};
const getUserProduct = async (req, res) => {
  const adminId = req.locals.userId;
  let productData;
  try {
    productData = await Product.find({ adminId });
    return res.status(200).send({
      status: 200,
      message: "product fetched successfully",
      data: productData,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch Product",
      data: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  const adminId = req.locals.userId;
  const productId = req.params.productId;
  console.log(productId);
  let productData;
  try {
    productData = await Product.findById(productId);
    if (!productData) {
      return res.status(400).send({
        status: 400,
        message: "Product not exists",
      });
    }
    if (productData && productData.adminId != adminId) {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized to delete a product",
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Product doesn't exists",
      data: error,
    });
  }

  try {
    await Product.findByIdAndDelete(productId);
    return res.status(200).send({
      status: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Failed to delete the product",
    });
  }
};

const editProduct = async (req, res) => {
  const { productId, productname, productDetails } = req.body;
  const adminId = req.locals.userId;
  let productData;

  try {
    productData = await Product.findById(productId);
    if (!productData) {
      return res.status(400).send({
        status: 400,
        message: "Product not exists",
      });
    }
    if (productData && productData.adminId != adminId) {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized to edit the product",
      });
    }
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Product doesn't exists",
      data: error,
    });
  }

  try {
    await Product.findByIdAndUpdate(productId, { productname, productDetails });
    return res.status(200).send({
      status: 200,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Failed to update the product",
    });
  }
};

const customerProduct = async (req, res) => {
  try {
    const productObj = await Product.find();
    return res.status(200).send({
      status: 200,
      message: "successfully fetched all the product's",
      data: productObj,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch the product's",
    });
  }
};

const adminFilter = async (req, res) => {
  let { createdBy } = req.params;
  console.log(createdBy);
  try {
    let productData = await Product.find({ createdBy });
    return res.status(200).send({
      status: 200,
      message: "successfully fetched all the product's",
      data: productData,
    });
  } catch (error) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch the product's",
    });
  }
};

module.exports = {
  createProduct,
  getUserProduct,
  deleteProduct,
  editProduct,
  customerProduct,
  adminFilter,
};
