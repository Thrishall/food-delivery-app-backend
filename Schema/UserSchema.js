const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        userName:{
            type:String,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        },
        gender:{
            type:String
        },
        country:{
            type:String,
            default: "India"
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        address:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"Address"
            }
        ],
        cart:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"Product"
            }
        ],
    }
)

module.exports = mongoose.model("User",UserSchema);

