const express = require("express");
const app = express();
const path = require("path");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

app.get("/dashboard.html",(req,res)=>{
  res.redirect('/auth/dashboard');
});
app.use(express.static(path.join(__dirname, 'public/views')));
app.use('/styles',express.static(path.join(__dirname, 'public/styles')));
app.use('/scripts',express.static(path.join(__dirname, 'public/src')));
app.use('/auth', authRoutes); // Mount authRoutes at /auth
app.use('/tasks', taskRoutes);


app.listen(3000, () => {
  console.log("Server is running on port", 3000);
});

app.get("*", (req, res) => {
  const errorMessage = "Page not found. The requested URL does not exist.";

  console.error(`404 Error: ${errorMessage}`);

  res.status(404);

  res.send(errorMessage);
});
