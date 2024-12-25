const Product = require("../../Schema/ProductSchema");
const Restaurant = require("../../Schema/RestaurantSchema");
const cloudinary = require("cloudinary").v2

const isSupported = (type,supportedTypes) => {
    return supportedTypes.includes(type)
}

async function uploadImgToCloudinary(file,folder) {
    const options = {folder}
    const response = await cloudinary.uploader.upload(file.tempFilePath,options)
    return response
}

const CreateProduct = async(req,res) => {
    try {

        const { name, description, price, category, restaurantId} = req.body;

        const image = req.files.image;

        if (!name || !description || !price || !category || !image || !restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required details carefully.",
            });
        }

        // Check if the restaurantId exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
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

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            imageUrl: response.secure_url,
            restaurantId
        });

        await newProduct.save();

        await Restaurant.findByIdAndUpdate(restaurantId,{$push:{products:newProduct._id}})

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });

    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


module.exports = {CreateProduct}