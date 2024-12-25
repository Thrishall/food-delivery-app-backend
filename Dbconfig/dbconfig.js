const mongoose = require("mongoose")
require("dotenv").config()

const dbConnect = async ()=>{
    await mongoose.connect(process.env.DATABASE_URL)
        .then((res)=>
            console.log("Established DataBase Connection Successfully")
        )
        .catch((err)=>{
            console.log("DataBase Connection Failed")
            console.log(err.message)
            process.exit(1)
        })
}

module.exports = dbConnect;