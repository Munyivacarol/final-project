document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  let currentTaskType = "Personal"; // Global variable to store current task type

  // Fetch tasks from db.json and display them
  fetchTasks(currentTaskType);

  // Function to fetch tasks from db.json and display them
  function fetchTasks(listValue) {
    fetch("db.json")
      .then((response) => response.json())
      .then((data) => {
        taskList.innerHTML = "";
        data.tasks.forEach((task) => {
          if (task.category == listValue) {
            displayTask(task);
          }
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }

  // Function to display a task item
  function displayTask(task) {
    const taskItem = document.createElement("li");
    taskItem.textContent = task.title;
    if (task.completed) {
      taskItem.classList.add("completed");
    }
    const deleteButton = document.createElement("span");
    deleteButton.textContent = "❌";
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });
    taskItem.appendChild(deleteButton);
    taskItem.addEventListener("click", function () {
      editTask(task);
    });
    taskList.appendChild(taskItem);
  }

  // Event listener to add a new task
  addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      const newTask = { title: taskText, completed: false, category: currentTaskType }; // Include current task type in the object
      fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })
        .then((response) => response.json())
        .then((data) => {
          displayTask(data);
          taskInput.value = "";
        })
        .catch((error) => console.error("Error adding task:", error));
    }
  });

  // Function to delete a task
  function deleteTask(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchTasks(currentTaskType); // Refresh tasks for the current task type
        } else {
          console.error("Failed to delete task");
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  }

  // Function to edit a task
  function editTask(task) {
    const newTitle = prompt("Edit task:", task.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      const updatedTask = { ...task, title: newTitle.trim() };
      fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })
        .then((response) => {
          if (response.ok) {
            fetchTasks(currentTaskType); // Refresh tasks for the current task type
          } else {
            console.error("Failed to update task");
          }
        })
        .catch((error) => console.error("Error updating task:", error));
    }
  }

  // Function to handle changing task type
  function selectedType(value) {
    currentTaskType = value; // Update current task type
    fetchTasks(currentTaskType); // Refresh tasks for the selected type
  }

  // Event listeners for category buttons
  document.getElementById("Business").addEventListener("click", function () {
    selectedType("Business"); // Set the current task type to Business
  });

  document.getElementById("Personal").addEventListener("click", function () {
    selectedType("Personal"); // Set the current task type to Personal
  });
});
