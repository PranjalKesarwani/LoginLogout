const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const cookie = require('js-cookie');
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 8000;
const hbs = require("hbs");
require("./db/conn");
const Register = require("./models/schema");
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth");

const staticPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");


app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(staticPath));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// console.log("dotenv is: "+process.env.SECRET_KEY)

app.get("/", (req, res) => {
    res.render("index.hbs");
})
app.get("/secret",auth, (req, res) => {
    // console.log(`This is cookie from cookie parser: ${req.cookies.jwt}`)
    res.render("secret.hbs");
})
app.get("/logout",auth, (req, res) => {
try {

    //This is filter method to logout from any particular user 
    // req.user.tokens = req.user.tokens.filter((currElement)=>{
    //     return currElement.token != req.token;

    // })

    //This is how we will logout from all the devices
    req.user.tokens = [];

    res.clearCookie("jwt");


    console.log("logged out successfully");

    req.user.save();

    res.render("login");
} catch (error) {
    res.status(501).send(error);
}
})
app.get("/login", (req, res) => {
    res.render("login.hbs");
})
app.get("/register", (req, res) => {
    res.render("register.hbs");
})

//POST requests starts here



app.post("/register", async (req, res) => {
    try {
        const password = req.body.pass;
        const cnfmPassword = req.body.cnfmpass;  //ye req.body ke baad likha hai wo password ke input field me name attribute hai

        if (password === cnfmPassword) {

            const registerUser = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.mobile,
                age: req.body.age,
                password: password,
                confirmpassword: cnfmPassword
            })

            // console.log("the success part " + registerUser );

                const token = await registerUser.generateAuthToken();
                // console.log("the token part in register is: "+token);

                //The res.cookie() function is used to set the cookie name to value.
                //The value parameter may be a string or object converted to JSON
                //Syntax
                //res.cookie(name, value, [options]);

                res.cookie("jwt", token,{
                    expires: new Date(Date.now()+90000),
                    httpOnly:true
                });
                // console.log(cookie);


            const registered = await registerUser.save();
            res.status(201).render("index");
        }
        else {
            res.send("password not matching")
        }
    } catch (error) {
        console.log(error);
    }
})

app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const loginPassword = req.body.password;

        // console.log(`${email} is your email and ${password} is your password`);
        const userEmail = await Register.findOne({ email: email });

      const isMatch = await bcrypt.compare(loginPassword,userEmail.password);

      const token = await userEmail.generateAuthToken();
      console.log("the token part in login is: "+token);
    res.cookie("jwt", token,{
        expires: new Date(Date.now()+90000),
        httpOnly:true,
        // secure:true    we can use it for https connection but we will use it when it go in production
    });


        if (isMatch) {
            res.status(201).render("index")
        }
        else {
            res.send("Invalid login Credentials credentials")
        }

    } catch (error) {
        res.status(400).send("Invalid login credentials")
    }
})




// const bcrypt = require("bcryptjs");

// const securePassword = async (password) => {
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);


//     const passwordMatch = await bcrypt.compare(password, passwordHash); //user yaha password login wala daalega and password hash is the password which is stored in the database
//     console.log(passwordMatch);
// }

// securePassword("pranjal@123");






// const jwt = require("jsonwebtoken");

// const createToken = async ()=>{
//     // jwt.sign({_id:"write the id"},"this is a secret key to generate a unique token");
//   const token = await  jwt.sign({_id:"63c7efae0d0d7921f522e2fe"},"onetwothreefourfivesixseveneightnineteneleventwelvethirteenfourteen",{expiresIn:"10 seconds"});
//   console.log(token)

//   const userVer =await jwt.verify(token,"onetwothreefourfivesixseveneightnineteneleventwelvethirteenfourteen");
//   console.log(userVer);

// }

// createToken();










app.listen(port, () => {
    console.log(`Port ${port} connected`);
})

