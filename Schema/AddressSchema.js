const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema(
    {
        state:{
            type:String,
            default:"New Delhi"
        },
        city:{
            type:String,
            default:"45, Green Street, Sector 12"
        },
        pinCode:{
            type:String,
            default:"110001"
        },
        phoneNo:{
            type:Number,
            default:"8734637468"
        },
        fullAddress:{
            type:String,
            default:"45, Green Street, Sector 12,New Delhi, 110001, India"
        }
    }
)

module.exports = mongoose.model("Address",AddressSchema);