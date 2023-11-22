const express = require("express");
const router = express.Router();
const productModel = require("../Models/productModel");

// * Get all products
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json(products);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// * Get one product
router.get("/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// * Create one product

router.post("/", async (req, res) => {
  const product = new productModel({
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
  });
  try {
    const newProduct = await product.save();
    return res.status(201).json(newProduct);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

// * Update one product
router.put("/:id", async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(200)
      .json({ product, msg: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// * Delete one product

router.delete("/:id", async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ product, msg: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//-----------using router.route()-----------------

/*router
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await productModel.find();
      return res.status(200).json(products);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  })
  .post(async (req, res) => {
    const product = new productModel({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
    });
    try {
      const newProduct = await product.save();
      return res.status(201).json(newProduct);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const product = await productModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res
        .status(200)
        .json({ product, msg: "Product updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const product = await productModel.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ product, msg: "Product deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
*/
module.exports = router; // ! Don't forget to export the router
