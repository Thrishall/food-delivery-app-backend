const express = require("express");
const CreateReviews = require("../Controllers/CreateReviews/createreviews");
const router = express.Router();
const IsAuth = require("../middlewares/auth")

// create route to register new product
router.post("/createreview/:restaurantId",IsAuth,CreateReviews)

module.exports = router;