const mongoose = require("mongoose");
// const path = require("path");
// require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_CONNECTION).then(()=>{
    console.log("Connected to database...");
}).catch((error)=>{
console.log("Databse connection failed");
})



// const mongoose = require("mongoose");

// mongoose.set('strictQuery',true);
// mongoose.connect("mongodb://localhost:27017/studentsapi").then(()=>{
//     console.log("Database created!");
// }).catch((e)=>{
//     console.log("Database connection failed!");
// })