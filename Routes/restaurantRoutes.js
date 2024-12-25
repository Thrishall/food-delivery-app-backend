const express = require("express");
const { createRestaurantController, getFilteredRestaurant } = require("../Controllers/RestaurantController/restaurant");
const IsAuth = require("../middlewares/auth");
const router = express.Router();

// create route to register new user
router.post("/createRestaurant",createRestaurantController)

router.get('/restaurants/:restaurant', IsAuth, getFilteredRestaurant);


module.exports = router;