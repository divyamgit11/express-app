const express = require('express');
const router = express.Router();
const fs = require("fs");
const session = require("express-session");
const crypto = require("crypto");
const { url } = require('inspector');



function generateRandomKey() {
    return crypto.randomBytes(32).toString("hex");
}

router.use(session({
    secret: generateRandomKey(),
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false}
  }));

router.use(urlencoded({extended:true}));
  

router.post("/login", (req, res) => {
    fs.readFile("./accounts.txt", "utf-8", (err, data) => {
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
        res.redirect("/dashboard");
      }
      else{
        res.status(401).send("Invalid username or password");
        res.send("Check credentials or register a new account. <a href='public/views/index.html'>Login now</a>")
      }
    });
  });
  
router.post("/signup", (req, res) => {
    fs.readFile("./accounts.txt", "utf-8", (err, data) => {
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
        res.send("Username already exists. <a href='/login.html'>Login now</a>");
        return;
      }
  
      const newUser = { username: req.body.username, password: req.body.password };
      records.push(newUser);
  
      fs.writeFile("./accounts.txt", JSON.stringify(records), "utf-8", (err) => {        //writeFile replaces the content of the file
        if (err) {
          console.error(err);
          res.status(500).send("Error occurred while writing to the file.");
          return;
        }
  
        res.send("New user registered. <a href='/public/index.html'>Login Now</a>");
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

  function auth(req,res,next){
    if(!req.session.user){
      res.status(401).send("You are not authenticated, please login first.");
      res.redirect("/index.html");
    }
    else{
      next();
    }
  }
  
  

    module.exports = {router,auth};