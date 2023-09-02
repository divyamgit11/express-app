const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.listen(3001, () => {
  console.log("Server is running on port", 3001);
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/404.html");
});

app.post("/login", (req, res) => {
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
      
      res.send("Welcome to the Express server, " + req.body.username + ".<br><a href='/'>Go back to the home page</a>");
    } else {
      res.send("Invalid Username/Password. <a href='/login.html'>Try again</a>");
    }
  });
});

app.post("/signup", (req, res) => {
  fs.readFile("./accounts.txt", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error occurred while reading the file.");
      return;
    }

    let records = JSON.parse(data);
    const newUser = { username: req.body.username, password: req.body.password };
    records.push(newUser);

    fs.writeFile("./accounts.txt", JSON.stringify(records), "utf-8", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error occurred while writing to the file.");
        return;
      }

      res.send("New user registered. <a href='/index.html'>Login now</a>");
    });
  });
});

