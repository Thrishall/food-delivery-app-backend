const express = require("express");
const { CreateProduct } = require("../Controllers/ProductController/Product");
// const IsAuth = require("../middlewares/auth");
const router = express.Router();

// create route to register new product
router.post("/createproduct",CreateProduct)

module.exports = router;