// Add Task Button Click Event
document.querySelector("#add-task-button").addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title").value;
    const taskDescription = document.querySelector("#task-description").value;
  
    const newTask = {
      title: taskTitle,
      description: taskDescription,
    };
  
    // Send a POST request to add a new task
    fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response and update the task list
        // Reload or update the task list on the dashboard
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  });
  