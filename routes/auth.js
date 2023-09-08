const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const crypto = require("crypto");



function generateRandomKey() {
    return crypto.randomBytes(32).toString("hex");
}

router.use(session({
    secret: generateRandomKey(),
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false}
  }));

router.use(express.urlencoded({extended:true}));
// Custom middleware to protect dashboard.html
router.use("/dashboard.html", (req, res, next) => {
  if (req.session && req.session.user) {
    // User is authenticated, allow access to dashboard.html
    next();
  } else {
    // User is not authenticated, redirect to login page or handle it accordingly
    res.status(401).redirect("/index.html");
  }
});
  

router.post("/login", (req, res) => {
  console.log("received login request");
  fs.readFile(path.join(__dirname, "../accounts.txt"), "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while reading the file.");
        return;
      }
  
      let records = JSON.parse(data);
      let result = records.find((item) => {
        return item.username === req.body.username && item.password === req.body.password;
      });
  
      if (result) {
        req.session.user = {username : result.username}; //set a session variable
        console.log("session set");
        res.redirect("/auth/dashboard"); 
      }
      else{
        res.status(401).send("Invalid username or password, please try again. <a href='../public/views/index.html'>Login now</a>");
      }
    });
  });
  
router.post("/signup", (req, res) => {
    fs.readFile("../accounts.txt", "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while reading the file.");
        return;
      }
  
      let records = JSON.parse(data);
  
      //check if username already exists
      const existingUser = records.find((item) => {
        return item.username === req.body.username;
      });
  
      if (existingUser) {
        res.send("Username already exists. <a href='../public/views/index.html'>Login now</a>");
        return;
      }
  
      const newUser = { username: req.body.username, password: req.body.password };
      records.push(newUser);
  
      fs.writeFile("../accounts.txt", JSON.stringify(records), "utf-8", (err) => {        //writeFile replaces the content of the file
        if (err) {
          console.error(err);
          res.status(500).send("Error occurred while writing to the file.");
          return;
        }
  
        res.send("New user registered. <a href='../public/views/index.html'>Login Now</a>");
      });
      req.session.user = {username : newUser.username}; //set a session variable
  
    });
  });

  router.get("/logout", (req, res) => {
    req.session.destroy((err)=>{
      if(err){
        console.error(err);
        res.status(500).send("Error occurred while logging out.");
        return;
      }
      res.redirect("/index.html");
    });
  });

  router.get("/dashboard",(req,res)=>{
    console.log("received dashboard request");
    if(req.session && req.session.user){
      res.status(201).redirect("/dashboard.html");
    }
    else{
      res.status(401).redirect("/index.html");
    }
  })
  
  

    module.exports = router