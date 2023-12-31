const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const crypto = require("crypto");
const parser = require("cookie-parser");


function generateRandomKey() {
    return crypto.randomBytes(32).toString("hex");
}

function auth(req,res,next){
  if(req.session.user){
    console.log("authorization successful")
     next();
    }
    else{
      console.log("you are not logged in unsuccesful authorization")
    res.redirect("/");}
}
router.use(session({
    secret: generateRandomKey(),
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false, maxAge: 1*60*1000} //1 min in milliseconds
  }));

  router.use(parser());

router.use(express.urlencoded({extended:true}));

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
      if(!req.session){
        console.log("session destroyed and logged out")
      }
      res.redirect("/index.html");
    });
  });

  router.get("/dashboard",auth,(req,res)=>{
    console.log("received dashboard request");
    res.sendFile(path.join(__dirname,"..","public/views/dashboard.html"));
  })
  
  

    module.exports = router