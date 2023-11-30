const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get("/signup", (req, res) => {
    res.render("sign_up")
});

app.post("/signup", (req, res) => {
    const uname = req.body.uname
    const email = req.body.email
    const passwd = req.body.password
    const newData = {
        uname: uname,
        email: email,
        passwd: passwd
    }

    fs.readFile("data.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }

        const dataFix = JSON.parse(data)
        for (let i = 0; i < dataFix.length; i++) {
            if (newData.uname === dataFix[i].uname || newData.email === dataFix[i].email) {
                // Set a message in res.locals to be displayed in the template
                res.locals.message = "This account already exists";
                // Render the signup page with the message
                return res.render("sign_up");
            }
        }
        dataFix.push(newData)
        const finalData = JSON.stringify(dataFix, null, 2)

        fs.writeFile("data.json", finalData, (err) => {
            if (err) {
                console.error(err)
                return res.status(500).send("Internal Server Error")
            }
            console.log("Data written to data.json")
            res.render("home")
        })
    })
})

app.get("/signin", (req, res) => {
    res.render("sign_in")
});

app.post("/signin", (req, res) => {
    const uname = req.body.uname
    const passwd = req.body.password

    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).send("Internal Server Error")
        }

        const userData = JSON.parse(data)

        for (let i = 0; i < userData.length; i++) {
            if (uname === userData[i].uname && passwd === userData[i].passwd) {
                return res.render("home")
            }
        }

        res.render("sign_in_error")
    })
})

app.listen(4040, () => {
    console.log(`Server running on port 4040.`)
})
