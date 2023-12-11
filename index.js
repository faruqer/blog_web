const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express()
mongoose.connect("mongodb+srv://faruq:faruq120910@cluster0.qnzsgnz.mongodb.net/userDB", {useNewUrlParser: true})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

let posts=["xujfgihf", "dhgfysb", "xidsusgfsd", "dgfsydfg"]
const userSchema =new mongoose.Schema({
    userName: String,
    email: String,
    password: String
})

const User= mongoose.model("User", userSchema)
let isAuthonticated=false
app.get("/", (req, res)=>{
    res.render("root")
})
app.get("/signup", (req, res) => {
    res.render("sign_up", { message: false });
})

app.post("/signup", (req, res) => {
    const userName = req.body.userName
    const email = req.body.email
    const password = req.body.password

    User.find()
    .then((users)=>{
        for (let i=0; i<users.length; i++){
            if (users[i].userName===userName){
                return res.render("sign_up", {message:"This user name is alredy take."})
            }else if(users[i].email===email){
                return res.render("sign_up", {message:"This email is alredy take."}) 
            }
        }
        const newData = new User ({
            userName: userName,
            email: email,
            password: password
        })
        return newData.save()
        .then(()=>{
            isAuthonticated=true
            res.redirect("/home")
        })
        
    })
    .catch((err)=>{
        console.log(err)
    })
    
})

app.get("/signin", (req, res) => {
    res.render("sign_in", {message:false})
});

app.post("/signin", (req, res) => {
    const userName = req.body.uname
    const password = req.body.password
    User.find()
        .then((users)=>{
            for (let i=0; i<users.length; i++){
                if (users[i].userName===userName){
                   if(users[i].password===password){
                    
                        isAuthonticated=true
                        res.redirect("/home")
                   } 
                }
            }
            res.render("sign_in", {message:"Incorrect user name or password"})
        })
        .catch((err)=>{
            console.log(err)
        })
})

app.get("/home", (req, res)=>{
    if(isAuthonticated){
    res.render("home", {posts:posts}) 
    }else{
        res.redirect("/signin")
    }
})
app.get("/post", (req, res)=>{
    if(isAuthonticated){
        res.render("post")
    }else{
        res.redirect("/signin")
    }
})

app.post("/post", (req, res)=>{
    posts.push(req.body.post)
    res.render("home", {posts:posts})
})

app.listen(4040, () => {
    console.log(`Server running on port 4040.`)
})
