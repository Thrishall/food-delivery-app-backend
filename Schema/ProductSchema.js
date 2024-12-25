const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        },
        restaurantId:{
            type:mongoose.Schema.ObjectId,
            ref:"Restaurant"
        },
        createdAt:{ 
            type: Date, 
            default: Date.now 
        },
    }
)

module.exports = mongoose.model("Product",ProductSchema)
  


  