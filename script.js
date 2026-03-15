
let storedData = localStorage.getItem("actionhub-tasks");

let tasks;

if (storedData) {
    tasks = JSON.parse(storedData);
} else {
    tasks = [];
}


let currentFilter = "all";

let editingTaskId = null;

function saveTasks() {

    let dataString = JSON.stringify(tasks);

    localStorage.setItem("actionhub-tasks", dataString);
}



function getTodayDate() {

    let today = new Date();

    let dateString = today.toISOString().split("T")[0];

    return dateString;
}

function addTask() {

    let titleInput = document.getElementById("task-input");
    let dueInput = document.getElementById("due-input");

    
    let title = titleInput.value.trim();
    let dueDate = dueInput.value;

   
    if (title === "") {
        alert("Please enter a task title");
        return;
    }

    
    let newTask = {
        id: Date.now(),   
        title: title,
        due: dueDate
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    titleInput.value = "";
    dueInput.value = "";
}

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        if (task.id !== id) {
            return true;
        } else {
            return false;
        }

    });

    saveTasks();
    renderTasks();
}

function startEdit(id) {

    let task = tasks.find(function(t) {
        return t.id === id;
    });

    if (!task) {
        return;
    }


    editingTaskId = id;

    document.getElementById("edit-title").value = task.title;
    document.getElementById("edit-due").value = task.due;

    
    document.getElementById("edit-row").classList.add("active");
}


function saveEdit() {

    let newTitle = document.getElementById("edit-title").value.trim();
    let newDue = document.getElementById("edit-due").value;

    if (newTitle === "") {
        alert("Title cannot be empty");
        return;
    }

    tasks = tasks.map(function(task) {

        if (task.id === editingTaskId) {

            return {
                id: task.id,
                title: newTitle,
                due: newDue
            };

        } else {
            return task;
        }

    });

    saveTasks();

    cancelEdit();

    renderTasks();
}


function cancelEdit() {

    editingTaskId = null;

    document.getElementById("edit-title").value = "";
    document.getElementById("edit-due").value = "";

    document.getElementById("edit-row").classList.remove("active");
}

function setFilter(filter, button) {

    currentFilter = filter;

    let buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    
    button.classList.add("active");

    renderTasks();
}



function getTaskStatus(dueDate) {

    let today = getTodayDate();

    if (!dueDate) return "upcoming";

    if (dueDate < today) return "overdue";

    if (dueDate === today) return "today";

    return "upcoming";
}


function renderTasks() {

    let today = getTodayDate();

    let taskList = document.getElementById("task-list");
    let emptyMsg = document.getElementById("empty-msg");

    let filteredTasks = [];

   
    if (currentFilter === "today") {

        filteredTasks = tasks.filter(task => task.due === today);
    } 
    else if (currentFilter === "upcoming") {

        filteredTasks = tasks.filter(task => task.due > today);
    }
    else if (currentFilter === "overdue") {

        filteredTasks = tasks.filter(task => task.due < today);
    }
    else {

        filteredTasks = tasks;

    }


    if (filteredTasks.length === 0) {

        taskList.innerHTML = "";
        emptyMsg.style.display = "block";
        return;

    }

    emptyMsg.style.display = "none";

    let html = "";

  
    filteredTasks.forEach(function(task) {

        let status = getTaskStatus(task.due);

        let dueText;

        if (task.due) {
            dueText = "Due: " + task.due;
        } else {
            dueText = "No due date";
        }

        html += `
        <div class="task-card ${status}">
            <div class="task-info">
                <div class="task-title">${task.title}</div>
                <div class="task-due">${dueText}</div>
            </div>

            <div class="task-actions">
                <button onclick="startEdit(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
        `;
    });

    taskList.innerHTML = html;
}

document.getElementById("task-input").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

renderTasks();