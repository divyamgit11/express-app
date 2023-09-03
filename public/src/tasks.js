// Add Task Button Click Event
document.querySelector("#add-task-button").addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title").value;
  const taskDescription = document.querySelector("#task-description").value;

  const newTask = {
      title: taskTitle,
      description: taskDescription,
      createdAt: null,
      completed: false,
      completedAt: null,
      id: Date.now().toString() // Generate a unique ID
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
          const taskElement = createTaskElement(data);
          document.querySelector("#task-table").appendChild(taskElement); // Assuming you have a table with the id "task-table" to display tasks.
      })
      .catch((error) => {
          console.error("Error adding task:", error);
      });
});

// Event listener for checkboxes (assuming a class "task-checkbox" is used for checkboxes)
document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
      const taskId = event.target.dataset.taskId;
      const completed = event.target.checked;

      // Send a PUT request to update the task's completion status
      fetch(`/tasks/${taskId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
      })
          .then((response) => response.json())
          .then((updatedTask) => {
              // Handle the response and update the task list if needed
          })
          .catch((error) => {
              console.error("Error updating task:", error);
          });
  });
});

// Event listener for delete buttons (assuming a class "delete-task" is used for delete buttons)
document.querySelectorAll(".delete-task").forEach((deleteButton) => {
  deleteButton.addEventListener("click", (event) => {
      const taskId = event.target.dataset.taskId;

      // Send a DELETE request to delete the task
      fetch(`/tasks/${taskId}`, {
          method: "DELETE",
      })
          .then((response) => {
              if (response.status === 204) {
                  // Task deleted successfully, remove it from the UI
                  event.target.parentElement.remove(); // Remove the task element from the DOM
              } else {
                  console.error("Error deleting task:", response.statusText);
              }
          })
          .catch((error) => {
              console.error("Error deleting task:", error);
          });
  });
});


function createTaskElement(task) {
  const taskElement = document.createElement("tr"); // Create a table row
  const checkboxElement = document.createElement("input");
  const titleElement = document.createElement("td"); // Create a table cell for the title

  checkboxElement.type = "checkbox";
  checkboxElement.className = "task-checkbox";
  checkboxElement.dataset.taskId = task.id;
  titleElement.className = "task-title";
  titleElement.textContent = task.title;

  taskElement.appendChild(checkboxElement);
  taskElement.appendChild(titleElement);

  return taskElement;
}
