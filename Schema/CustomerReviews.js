const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        User: { 
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }, 
        restaurantId :{
            type: mongoose.Schema.ObjectId,
            ref: "Restaurant"
        },
        reviewText: { 
            type: String, 
            required: true 
        },
        createdAt:{ 
            type: Date, 
            default: Date.now() 
        },
});

module.exports = mongoose.model('CustomerReview', reviewSchema);
