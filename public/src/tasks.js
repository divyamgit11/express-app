function loadTasksFromServer(){
    fetch("/tasks")
    .then((res)=>res.json())
    .then((tasks)=>{
        //Clear the UI and child elements if any
        const taskTable = document.querySelector("#task-table tbody");
        taskTable.innerHTML = "";

        tasks.forEach((task,index)=>{
            const serialNumber = index + 1;
            const taskElement = createTaskElement(task,serialNumber);
            taskTable.appendChild(taskElement);

            //add eventListeners to all the tasks we got from server
            taskElement.querySelector(".task-checkbox").addEventListener("change",updateTask);
            taskElement.querySelector(".delete-button").addEventListener("click",deleteTask);
        });
    })

    .catch((err)=>{
        if(err)
        console.log("error loading tasks from server ",err);
    });
}

loadTasksFromServer();

document.querySelector("#add-task-button").addEventListener("click",(event)=>{
    event.preventDefault();
    const taskTitle = document.querySelector("#task-title").value;
    const taskDescription = document.querySelector("#task-description").value;

    if (!taskTitle || !taskDescription) {
        // Display an alert or error message
        alert("Task title and task description are required fields");
        return; // Exit the function to prevent further processing
    }

    const newTask = {title : taskTitle, description : taskDescription};
    fetch("/tasks",{
        method: "POST",
        headers:{"Content-type":"application/json"},
        body: JSON.stringify(newTask)
    })
    .then((res)=>res.json())
    .then(()=>{
        document.querySelector("#task-title").value = "";
        document.querySelector("#task-description").value = ""; //clear input

        loadTasksFromServer();
    })

    .catch((err)=>{
        if(err)
        console.log("error adding task ",err);
    });
});

function updateTask(event) {
    const taskId = event.target.closest("tr").dataset.taskId;
    const completed = event.target.checked;

    // Display a confirmation message
    if (completed && !confirm("Are you sure you want to mark this task as completed?")) {
        // If the user cancels, prevent the checkbox from being checked
        event.preventDefault();
        return;
    }

    // Send a PUT request to update the task's completion status
    fetch(`/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
    })
    .then((response) => response.json())
    .then((task) => {
        // Handle the response and update the task's completion status in the UI if needed
        const taskRow = event.target.parentElement.parentElement;
        const completedElement = taskRow.querySelector(".task-completed");
        const completedAtElement = taskRow.querySelector(".task-completedAt");

        completedElement.textContent = task.completed;
        completedAtElement.textContent = task.completedAt;

        if (task.completed) {
            event.target.disabled = true; // Disable the checkbox for completed tasks
        } else {
            event.target.disabled = false; // Enable the checkbox for incomplete tasks
        }
    })
    .catch((error) => {
        console.error("Error updating task:", error);
    });
}


function deleteTask(event) {
    const taskId = event.target.closest("tr").dataset.taskId;

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
}


function createTaskElement(task,serialNumber){
    const taskElement = document.createElement("tr");
    const serialNumberElement = document.createElement("td");
    const titleElement = document.createElement("td");
    const descriptionElement = document.createElement("td"); 
    const createdAtElement = document.createElement("td"); 
    const completedElement = document.createElement("td"); 
    const completedAtElement = document.createElement("td"); 
    const actionElement = document.createElement("td");
    const checkboxElement = document.createElement("input");
    const deleteButton = document.createElement("button");

    taskElement.dataset.taskId = task.id;

    serialNumberElement.textContent = serialNumber;
    titleElement.textContent = task.title;
    descriptionElement.textContent = task.description;
    createdAtElement.textContent = task.createdAt;
    completedElement.textContent = task.completed;
    completedAtElement.textContent = task.completedAt;

    completedElement.className = "task-completed";
    completedAtElement.className = "task-completedAt";
    checkboxElement.type = "checkbox";
    checkboxElement.className = "task-checkbox";
    if(task.completed){
        checkboxElement.disabled = true;
    }
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete-button";

    actionElement.appendChild(checkboxElement);
    actionElement.appendChild(deleteButton);

    taskElement.appendChild(serialNumberElement);
    taskElement.appendChild(titleElement);
    taskElement.appendChild(descriptionElement);
    taskElement.appendChild(createdAtElement);
    taskElement.appendChild(completedElement);
    taskElement.appendChild(completedAtElement);
    taskElement.appendChild(actionElement);

    return taskElement;
}