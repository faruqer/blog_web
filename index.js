const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");



const app = express()
mongoose.connect("mongodb+srv://faruq:faruq120910@cluster0.qnzsgnz.mongodb.net/userDataDB", {useNewUrlParser: true})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


const postSchema = new mongoose.Schema({
    title:String,
    content: String,
  });

  const userDataSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    profile: String,
    posts: [
        {
            title: String,
            content: String,
            date: { type: Date, default: Date.now }
        }
    ]
});


const Post= mongoose.model("Post", postSchema)
const User= mongoose.model("User", userDataSchema)

let isAuthenticated=false
let currentUser=""

app.get("/", (req, res)=>{
    res.render("root")
})

app.get("/signup", (req, res) => {
    res.render("sign_up", { message: false });
})

app.get("/signin", (req, res) => {
    res.render("sign_in", {message:false})
})

app.get("/home", (req, res)=>{
    if(isAuthenticated){
        User.find()
            .then((datas)=>{
                let posts=[]
                datas.forEach(data=>{
                    posts.push(data.posts)
                })
                res.render("home", {userName:currentUser, posts:posts})
            })
        
    }else{
        res.redirect("/signin")
    }
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
            isAuthenticated=true
            currentUser=userName
            res.redirect("/home")
        })
        
    })
    .catch((err)=>{
        console.log(err)
    })
    
})


app.post("/signin", (req, res) => {
    const userName = req.body.uname
    const password = req.body.password
    User.find()
        .then((users)=>{
            for (let i=0; i<users.length; i++){
                if (users[i].userName===userName){
                   if(users[i].password===password){
                        isAuthenticated=true
                        currentUser=userName
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

app.get("/post", (req, res)=>{
    if(isAuthenticated){
        res.render("post")
    }else{
        res.redirect("/signin")
    } 
})

app.post("/post", (req, res)=>{

    const newPost = ({
        title: req.body.title,
        content: req.body.content
    })
    User.findOne({userName:currentUser})
    .then(user=>{
        if (user){
            user.posts.push(newPost)
            user.save()
            res.redirect("/home") 
        }else{
            return null
        }
    })
    .catch(err=>{
        console.log(err)
    }) 
})


app.listen(4040, () => {
    console.log(`Server running on port 4040.`)
})
