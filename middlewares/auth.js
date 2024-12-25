const jwt = require("jsonwebtoken");
require("dotenv").config();

const IsAuth = (req,res,next) => {
    try{

        const token = req.body?.token || req.cookie?.token || req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            return res.status(403).json({
                success: false,
                message: "Token Missing"
            });
        }

        try {
            const verifyToken = jwt.verify(token,process.env.JWT_SECRET)
            req.user = verifyToken

        }catch(err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        next()

    } catch(err){
        return res.status(500).json(
            {
                success: false, 
                data: "Something went wrong while authorization",
                message: `${err.message}`                
            }
        );
    }
}

module.exports = IsAuth;