// require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

//Creating json web tokens
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() },process.env.SECRET_KEY);
        // console.log("This is token generated form schema side: "+token);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;

    } catch (error) {
        res.send("Error");
        // console.log(`The error is: ${error}`);
    }
}

//Converting password into hash
userSchema.pre("save", async function (next) {    //yaha save event hone se pehle ye function run kara dega, save event means before saving the data in the database

    try {
        // console.log(`the current password is ${this.password}`)
        // this.password = await bcrypt.hash(this.password,10);
        // console.log(`the hashed password is ${this.password}`)
        if (this.isModified("password")) {
            // console.log(`the current password is ${this.password}`)
            this.password = await bcrypt.hash(this.password, 10);
            // console.log(`the hashed password is ${this.password}`)
            this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);

            next() //ab save method call ho jayega

        }
    } catch (error) {
        res.send(error);
    }






}) //yaha arrow function use ni kr sakte kyuki you have to use this key word as this keyword can't be used in arrow function

const userModel = new mongoose.model("userCollection", userSchema);

module.exports = userModel;