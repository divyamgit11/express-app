// Add Task Button Click Event
document.querySelector("#add-task-button").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the form from submitting
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
        document.querySelector("#task-table tbody").appendChild(taskElement); // Append to the table body
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
                event.target.parentElement.parentElement.remove(); // Remove the task row from the DOM
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
    const serialNoElement = document.createElement("td"); // Create a table cell for serial number
    const titleElement = document.createElement("td"); // Create a table cell for the title
    const descriptionElement = document.createElement("td"); // Create a table cell for the description
    const createdAtElement = document.createElement("td");  // table cell for cratedAtElement
    const completedElement = document.createElement("td");
    const completedAtElement = document.createElement("td");
    const actionElement = document.createElement("td"); // Create a table cell for the action

    actionElement.type = "checkbox";
    actionElement.className = "task-checkbox";
    actionElement.dataset.taskId = task.id;
    titleElement.className = "task-title";
    titleElement.textContent = task.title;
    descriptionElement.idName = "task-description";
    descriptionElement.textContent = task.description;
    createdAtElement.textContent = task.createdAt;
    completedElement.textContent = task.completed;
    completedAtElement.textContent = task.completedAt;

    // Append the elements to the task row
    taskElement.appendChild(serialNoElement);
    taskElement.appendChild(titleElement);
    taskElement.appendChild(descriptionElement);
    taskElement.appendChild(createdAtElement);
    taskElement.appendChild(completedElement);
    taskElement.appendChild(completedAtElement);
    taskElement.appendChild(actionElement);

    return taskElement;
}
