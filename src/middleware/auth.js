const jwt = require("jsonwebtoken");
const userModel = require("../models/schema");

const auth = async (req, res, next) => {  //jaha kahi bi middlewares use kr rahe hai waha next() zrur call kr rahe taki middleware ke baad ka bi kaam ho sake
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log("verifyUser is: "+verifyUser); //this returns array of an object which is your document. Authentication yahi complete ho jata hai neeche toh sab logout ke liye ab code likh rahe hai
 //yaha se logout ka code likhna shuru ho gaya
        const user =await userModel.findOne({ _id: verifyUser._id }); //is object ki id ki help se whole document nikala
        console.log(user);

        req.token = token;
        req.user =  user;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;