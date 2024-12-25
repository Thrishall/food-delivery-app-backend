const cloudinary = require("cloudinary").v2
const Restaurant = require("../../Schema/RestaurantSchema")

const isSupported = (type,supportedTypes) => {
    return supportedTypes.includes(type)
}

async function uploadImgToCloudinary(file,folder) {
    const options = {folder}
    const response = await cloudinary.uploader.upload(file.tempFilePath,options)
    return response
}

const createRestaurantController = async (req, res) => {
    try {
        const { name, rating, reviews, address, phoneNo, website, deliveryInformation,estimatedTime,message } = req.body;
        const {image} = req.files;

        if (!name || !rating || !reviews || !image || !address || !phoneNo || !website || !deliveryInformation ||!estimatedTime ||!message) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required details carefully.",
            });
        }

        let parsedDeliveryInformation;
        try {
            parsedDeliveryInformation = typeof deliveryInformation === "string" ? JSON.parse(deliveryInformation) : deliveryInformation;
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid deliveryInformation format. It should be a valid JSON array.",
            });
        }

        // Check if the restaurant already exists
        const restaurantExist = await Restaurant.findOne({ name, phoneNo });
        if (restaurantExist) {
            return res.status(409).json({
                success: false,
                message: "Restaurant already exists with the same name or phone number.",
            });
        }

        // upload image to cloudinary
        const supportedTypes = ['jpeg',"jpg","png"]
        const imgType = image.name.split(".")[1].toLowerCase()

        if(!isSupported(imgType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File Format not Supported"
            })
        }

        const response = await uploadImgToCloudinary(image,"food-delivery-app")

        // Create a new restaurant
        const newRestaurant = await Restaurant.create({
            name,
            rating,
            reviews,
            Image:response.secure_url,
            address,
            phoneNo,
            website,
            deliveryInformation:parsedDeliveryInformation,
            estimatedTime,
            message
        });

        return res.status(201).json({
            success: true,
            response: newRestaurant,
            message: "New restaurant registered successfully.",
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${err.message}`,
        });
    }
};

const getFilteredRestaurant = async(req,res) => {
    try {

        const {restaurant} = req.params;

        if (!restaurant) {
            return res.status(400).json({
                success: false,
                message: "invalid details",
            });
        }

        // find restaurant.
        const restaurantExist = await Restaurant.find({name:restaurant})
        .populate("products")
        .populate({
            path: "Customer",
            populate: {
                path: "User",
                select: "userName country"
            },
        });

        if(!restaurantExist){
            return res.status(401).json({
                success: false,
                message: "Restaurant not Found",
            });
        }

        return res.status(201).json({
            success: true,
            data: restaurantExist,
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${err.message}`,
        });
    }

}

module.exports = { createRestaurantController, getFilteredRestaurant }

