const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const dashboardRoutes = require("./routes/dashboard");

app.use(express.static("public/views"));
app.use('/auth',authRoutes);
app.use('/tasks',taskRoutes);
app.use('/',dashboardRoutes);

app.listen(3001, () => {
  console.log("Server is running on port", 3001);
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/views/404.html");
});
