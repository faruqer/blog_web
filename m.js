const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express()
mongoose.connect("mongodb+srv://faruq:faruq120910@cluster0.qnzsgnz.mongodb.net/testDB", {useNewUrlParser: true})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

const postSchema = new mongoose.Schema({
    title:String,
    content: String,
  });

const postDataSchema = new mongoose.Schema({
    name:String,
    age:Number,
    posts:[postSchema]
})


const Post= mongoose.model("Post", postSchema)
const User= mongoose.model("User", userDataSchema)
const PostData= mongoose.model("PostData", postDataSchema)


app.post("/p", (req, res)=>{
    const post = new Post({
        title:req.body.t,
        content: req.body.c
    })
    post.save()
})
app.listen(4040, () => {
    console.log(`Server running on port 4040.`)
})
