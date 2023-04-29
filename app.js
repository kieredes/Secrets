//jshint esversion:6
//added dotenv on the top as environment vairable

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose");

//encryption
const encrypt= require("mongoose-encryption");

const app = express();

//console.log(process.env.API_KEY)

// static resource for public folder
app.use(express.static("public"));
// view engine as EJS
app.set("view engine", "ejs");

//body parser
app.use(bodyParser.urlencoded({
    extended: true,
}));


//connecting to mongoDB
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});


//create a schema after connecting to mongoose
// added a mongoose.schema level2
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// adding a secret
//move the secret to .env
//const secret = "ThisisourSecret."
//encrypt entire DB

//called the secret var from .env 
var secret=process.env.SECRET
userSchema.plugin(encrypt,{secret: secret, encryptedFields: ["password"]});



const User = new mongoose.model("User", userSchema);





//building up server
app.get("/", function(req, res){
    //rendering home page
    res.render("home");
})


app.get("/login", function(req, res){
    //rendering home page
    res.render("login");
});
//req first, then res
app.get("/register", function(req, res){
    //rendering home page
    res.render("register");
});


app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save()
    .then(()=>{
            res.render("secrets");
        })
    .catch((err)=>{
            console.log(err);
        })
    
})


app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    
    // User.findOne({email: username}, function(err, foundUser){
    //     if (err){
    //         console.log(err);
    //     }else{
    //         if (foundUser){
    //             if (foundUser.password === password){
    //                 res.render("secrets")
    //             }
    //         }
    //     }
    // }); module.findOne has been updated to async
    async function find(username, password) {
        try {
            const found = await User.findOne({ email: username });
            if (found.password == password) {
                res.render("secrets")
            } else {
                console.log("wrong password");
            }
        } catch (error) {
            console.log(error)
        }
 
    }
    find(username, password);

});

app.listen(3000, function(){
    console.log("Server started on port 3000");
})