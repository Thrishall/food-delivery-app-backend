const express = require("express");
const { registerController, loginController, updateUserController, getUserController, deleteCartItem, addAddress } = require("../Controllers/UserController/user");

const IsAuth = require("../middlewares/auth");
const router = express.Router();

// create route to register new user
router.post("/register",registerController)

// create route for user login
router.post("/login",loginController)

// create route for user updation
router.put("/update-details", IsAuth, updateUserController)

// create route for getting user
router.get("/getUser", IsAuth, getUserController)

// create route for deleting cartitems
router.patch("/delete-items",IsAuth, deleteCartItem)

// create route for adding address
router.post("/add-address",IsAuth, addAddress)


module.exports = router;