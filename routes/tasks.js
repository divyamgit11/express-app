const express = require('express');
const router = express.Router();
const fs = require("fs");
const taskFilePath = __dirname + "/public/src/tasks.json";

router.use(express.json());
router.use(express.urlencoded({extended:true}));

function readTasksFromFile() {
  const tasks = fs.readFileSync(taskFilePath, "utf8");
  return JSON.parse(tasks);
}

const tasks = readTasksFromFile();
router.get("/tasks", (req, res) => {
  res.json(tasks);
});

router.post("/tasks", (req, res) => {
  const newTask = {title: req.body.title, description: req.body.description, createdAt: new Date().toISOString(), completed: false, completedAt: null};
  tasks.push(newTask);

  fs.writeFileSync(taskFilePath, JSON.stringify(tasks), "utf8");
  res.json(newTask);
});

//PUT task completion status update
router.put("/tasks/:id",(req,res)=>{
  const taskId = req.params.id;
  const task = tasks.find((task)=>task.id === taskId);
  if(!task){
    res.status(404).send("Task not found");
    return;
  }
  task.completed = true;
  task.completedAt = new Date().toISOString();
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks), "utf8");
  res.json(task);
})

//DELETE task
router.delete("/tasks/:id",(req,res)=>{
  const taskId = req.params.id;
  const taskIndex = tasks.findIndex((task)=>task.id === taskId);
  if(taskIndex === -1){
    res.status(404).send("Task not found");
    return;
  }
  tasks.splice(taskIndex,1);
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks), "utf8");
  res.sendStatus(204).json({message:"Task deleted successfully"});
})

module.exports = router;