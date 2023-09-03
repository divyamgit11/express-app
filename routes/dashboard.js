const express = require("express");
const router = express.Router();
const auth = require("./auth");

router.get("/dashboard", auth, (req, res) => {
    res.sendFile(__dirname+"/public/views/dashboard.html");
});

module.exports = router;
  