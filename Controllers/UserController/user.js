const User = require("../../Schema/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Address = require("../../Schema/AddressSchema");

const registerController =  async(req,res)=>{
    try{
        const {userName,email,phoneNo,password} = req.body;

        if(!userName || !email || !phoneNo || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details Carefully"
            });
        }

        const userExist = await User.findOne({email});

        if(userExist){
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password,10)

        const newUser = await User.create({userName,email,phoneNo,password:hashPassword})

        const defaultAddress = await Address.create({
            state:"New Delhi",
            city:"New Delhi",
            pinCode:"110001",
            phoneNo:8734637468,
            fullAddress:"45, Green Street, Sector 12,New Delhi, 110001, India"
        })

        newUser.address.push(defaultAddress._id)

        await newUser.save()

        return res.status(201).json(
            {
                success: true, 
                message: "User Registered successfully",      
            }
        )

    } catch(err){
        return res.status(500).json(
            {
                success: false, 
                data: "Something went wrong please try again later.",
                message: `Internal Server error , ${err.message}`                
            }
        );
    }
}

const loginController =  async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details Carefully"
            });
        }

        const userExist = await User.findOne({email});

        if(!userExist){
            return res.status(404).json({
                success: false,
                message: "User not registered"
            });
        }
        
        const isPasswordVerified = await bcrypt.compare(password,userExist.password)

        if(!isPasswordVerified){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = await User.findById(userExist._id).select("-password -__v").populate("address")

        const payload = {
            id: userExist._id
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn: "24h"
        })

        const options = {
            expiresIn : new Date( Date.now()+1*24*60*60*1000),
            httpOnly:true,
        }

        return res.cookie("cookies",token,options).status(201).json({
            success:true,
            token,
            message:"User Logged in Successfully",
            data:user
        })

    } catch(err){
        return res.status(500).json(
            {
                success: false, 
                data: "Something went wrong, please try again later.",
                message: `Internal Server error , ${err.message}`                
            }
        );
    }
}

const updateUserController = async(req,res)=>{
    try {
        const user = req.user;

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Token is missing",
            });
        }

        const {userName,email,phoneNo,gender,paymentMethod,productId,country} = req.body;

        const userExist = await User.findById(user.id).populate("cart")

        if(!userExist){
            return res.status(401).json({
                success: false,
                message: "User is invalid or not found",
            });
        }

        if (userName) userExist.userName = userName;
        if (email) userExist.email = email;
        if (phoneNo) userExist.phoneNo = phoneNo;
        if (gender) userExist.gender = gender;
        if (country) userExist.country = country
        if (paymentMethod) userExist.paymentMethod = paymentMethod;

        if (productId) userExist.cart.push(productId);

        await userExist.save()

        const updatedUser = await User.findById(userExist._id).select("-password -__v").populate("cart address").exec()

        return res.status(201).json(
            {
                success: true, 
                message: "User Updated Successfully",
                data: updatedUser   
            }
        );

    } catch(err){
        return res.status(500).json(
            {
                success: false, 
                data: "Something went wrong while updating user please try again later",
                message: `Internal Server error , ${err.message}`                
            }
        )
    }
}

const getUserController = async(req,res) => {
    try {

        const user = req.user;

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Token is missing",
            });
        }

        const userExist = await User.findById(user.id).select('-password -__v').populate("cart address")

        if(!userExist){
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(201).json(
            {
                success: true, 
                data: userExist 
            }
        );
        
    } catch(err) {
        return res.status(500).json(
            {
                success: false, 
                data: "Something went wrong while updating user please try again later",
                message: `Internal Server error , ${err.message}`                
            }
        )
    }
}

const deleteCartItem = async(req,res) => {
    try {

        const user = req.user;

        const {productId} = req.body


        if(!user){
            return res.status(400).json({
                success: false,
                message: "Token is missing",
            });
        }

        const userExist = await User.findById(user.id)

        if(!userExist){
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (!productId) {
            userExist.cart = [];
        } else {
            const index = userExist.cart.indexOf(productId);
            if (index > -1) {
                userExist.cart.splice(index, 1);
            }
        }

        await userExist.save()

        const updatedUser = await User.findById(userExist._id).populate("cart")

        return res.status(201).json(
            {
                success: true, 
                data: updatedUser 
            }
        );

    } catch(err) {
        return res.status(500).json(
            {
                success: false, 
                data: "Something went wrong while updating user please try again later",
                message: `Internal Server error , ${err.message}`                
            }
        )
    }
}

const addAddress = async(req,res) => {
    try {
        const user = req.user;

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Token is missing",
            });
        }

        const userExist = await User.findById(user.id)

        if(!userExist){
            return res.status(401).json({
                success: false,
                message: "User is invalid or not found",
            });
        }

        const {state,city,pinCode,phoneNo,fullAddress} = req.body;

        if(!state || !city || !pinCode || !phoneNo || !fullAddress){
            return res.status(400).json({
                success: false,
                message: "Please provide all the details Carefully"
            });
        }

        const newAddress = await Address.create({state,city,pinCode,phoneNo,fullAddress})

        const updatedUser = await User.findByIdAndUpdate(userExist._id,{$push:{address:newAddress._id}},{new:true}).populate("cart address").select("-password -__v")

        return res.status(201).json(
            {
                success: true, 
                message: "User Updated Successfully",
                data: updatedUser
            }
        );

    } catch(err){
        return res.status(500).json(
            {
                success: false, 
                data: "Something went wrong while updating user please try again later",
                message: `Internal Server error , ${err.message}`                
            }
        )
    }
}

module.exports = { registerController , loginController, updateUserController, getUserController, deleteCartItem , addAddress};