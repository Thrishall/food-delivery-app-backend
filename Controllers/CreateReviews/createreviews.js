const CustomerReviews = require("../../Schema/CustomerReviews");
const Restaurant = require("../../Schema/RestaurantSchema");
const User = require("../../Schema/UserSchema");

const CreateReviews = async(req,res) => {

    try {
            const user = req.user

            if (!user) {
                return res.status(401).json({ message: "Token Missing" });
            }

            const {restaurantId} = req.params;
            const {reviewText} = req.body;

            const userExist = await User.findById(user.id);
    
            if (!userExist) {
                return res.status(404).json({ message: "User not found" });
            }

            const restaurant = await Restaurant.findById(restaurantId);
    
            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant not found" });
            }
    
            // Create new review
            const newReview = await CustomerReviews.create({
                User:userExist._id,
                restaurantId:restaurant._id,
                reviewText: reviewText,
            })

            await newReview.populate("User")

            await Restaurant.findByIdAndUpdate(restaurantId,{$push:{Customer:newReview._id}},{new:true})
    
            // Send response
            res.status(201).json({
                success: true,
                message: "Review created successfully!",
                data: newReview,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "An error occurred while creating the review",
            });
        }
}

module.exports = CreateReviews