const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const taskFilePath = path.join(__dirname,"../public/src/tasks.json");

router.use(express.json());
router.use(express.urlencoded({extended:true}));

function readTasksFromFile() {
  const tasks = fs.readFileSync(taskFilePath, "utf8");
  return JSON.parse(tasks);
}

const tasks = readTasksFromFile();
router.get("/", (req, res) => {
  res.json(tasks);
});

router.post("/", (req, res) => {
  const newTask = {title: req.body.title, description: req.body.description, createdAt: new Date().toISOString(), completed: false, completedAt: null, id: Date.now().toString()};
  tasks.push(newTask);

  fs.writeFileSync(taskFilePath, JSON.stringify(tasks), "utf8");
  res.json(newTask);
});

//PUT task completion status update
router.put("/:id",(req,res)=>{
  console.log("received task update request");
  const taskId = req.params.id;
  const task = tasks.find((task)=>task.id === taskId);
  if(!task){
    res.status(404).send("Task not found");
    return;
  }
  task.completed = req.body.completed;
  if (req.body.completed) {
    task.completedAt = new Date().toISOString(); // Set timestamp if task is completed
  } else {
    task.completedAt = null; // Clear timestamp if task is incomplete
  }
  fs.writeFileSync(taskFilePath, JSON.stringify(tasks), "utf8");
  res.json(task);
})

//DELETE task
router.delete("/:id",(req,res)=>{
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