const express = require("express");
const router = express.Router();
const userModel = require("../Models/userModel");
const productModel = require("../Models/productModel");
// * Get all users
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

// * Get one user

router.get("/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// * Create one user

router.post("/", async (req, res) => {
  const user = new userModel({
    name: req.body.name,
    userType: req.body.userType,
    shoppingCart: req.body.shoppingCart,
  });
  try {
    const newUser = await user.save();
    return res.status(201).json(newUser);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

// * Update one user

router.put("/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id,{name:req.body.name}, {
      new: true,
    });
    return res.status(200).json({ user, msg: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// * Delete one user

router.delete("/:id", async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ user, msg: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// get shopping cart
router.get("/cart/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    return res.status(200).json(user.shoppingCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//* add to cart
router.post("/addTocart/:id/:productid", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    const product = await productModel.findById(req.params.productid);
    user.shoppingCart.push(product);
    const newUser = await user.save();// save here works as update
    return res.status(201).json(newUser);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

//* remove from cart
router.put("/removeFromcart/:id/:productid", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    const product = await productModel.findById(req.params.productid);
    user.shoppingCart.pull(product);
    const newUser = await user.save();
    return res.status(201).json(newUser);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});
//*checkout
router.get("/checkout/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    const total = user.shoppingCart.reduce(
      (total, product) => total + product.price,
      0
    );
   await userModel.findByIdAndUpdate(req.params.id,{shoppingCart:[]}, {
      new: true,
    });
    console.log(total);
    return res.status(200).json(total);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//------------using router.route()-----------------

/*
router
  .route("/")
  .get(async (req, res) => {
    try {
      const users = await userModel.find();
      return res.status(200).json(users);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  })
  .post(async (req, res) => {
    const user = new userModel({
      name: req.body.name,
      userType: req.body.userType,
      shoppingCart: req.body.shoppingCart,
    });
    try {
      const newUser = await user.save();
      return res.status(201).json(newUser);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  })
  .put(async (req, res) => {
    try {
      const user = await userModel.findByIdAndUpdate(req.params.id,{name:req.body.name}, {
        new: true,
      });
      return res.status(200).json({ user, msg: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }).delete(async (req, res) => {   
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({ user, msg: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });   
*/
module.exports = router;
