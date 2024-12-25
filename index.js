const express = require("express");
const app = express();
require("dotenv").config();
const fileUpload = require("express-fileupload");

const cors = require("cors");
const dbConnect = require("./Dbconfig/dbconfig");
const cloudinaryConnect = require("./cloudinaryconfig/cloudinaryconfig");
const userRouter = require("./Routes/UserRoutes");
const restaurantRouter = require("./Routes/restaurantRoutes");
const productRouter = require("./Routes/productRoutes");
const customerReview = require("./Routes/customerRoutes");

const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: ['https://vercel.com/thrishall-rs-projects/food-delivery-app-frontend', 'http://localhost:5173'],
    credentials: true           
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(fileUpload(
    {
        useTempFiles:true,
        tempFileDir:"/tmp/"
    }
))

app.use('/api/v1',userRouter)
app.use('/api/v1',restaurantRouter)
app.use("/api/V1",productRouter)
app.use("/api/V1",customerReview)

app.listen(PORT,()=>{
    console.log(`Server started at Port ${process.env.PORT}`)
})

dbConnect();
cloudinaryConnect();




