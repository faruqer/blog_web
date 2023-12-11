
<%= let valid=false %>
<%= while(!valid) %>
<%= if (password===conforme){ %>
   <%= valid=true %>
   <%=}%>


   fs.readFile("data.json", 'utf8', (err, data) => {
      if (err) {
          console.error(err)
          return res.status(500).send("Internal Server Error")
      }

      const dataFix = JSON.parse(data)
      for (let i = 0; i < dataFix.length; i++) {
          if (newData.uname === dataFix[i].uname) {
              const message = "This username already exists"
              return res.render("sign_up", { message: message })
          }
      }
      for (let i = 0; i < dataFix.length; i++) {
          if (newData.email === dataFix[i].email) {
              const message = "This email is taken"
              return res.render("sign_up", { message: message })
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




  fs.readFile("data.json", "utf8", (err, data) => {
   if (err) {
       console.error(err)
       return res.status(500).send("Internal Server Error")
   }
   
   const userData = JSON.parse(data)
   let userFound=false
   for (let i = 0; i < userData.length; i++) {
       if (uname === userData[i].uname && passwd===userData[i].passwd) {
           userFound=true
           break
       }
   }
   if (userFound){
       return res.render("home")
   }else{
       const message = "Incorrect Username or Password"
       return res.render("sign_in", { message: message })
   }
})
