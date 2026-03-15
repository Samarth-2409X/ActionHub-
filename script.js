let storedData = localStorage.getItem("actionhub-tasks");

if(storedData){
  tasks = JSON.parse(storedData);
}
else{
  tasks = [];
}

let currentFilter = "all";

let editingId = null;

function saveTask(){

  let dtaString = JSON.stringify(tasks);

  localStorage.setItem("actionhub-tasks", dtaString);
}

function getTodaysData(){

  let today = new Date();

  let dateString = today.toISOString().split("T")[0];

  return dateString;
}

function addTasks(){
  let titleInput = document.getElementById("task-input");
  let dueinput = document.getElementById("due-input");

  let title = titleInput.value.trim();
  let dueDate = dueinput.value;

  if(title == ""){
    alert("Please enter the title");
    return;
  }

  let newTask = {
    id:Date.now(),
    title:title,
    due:dueDate
  }

  tasks.unshift(newTask);

  saveTask();
  renderTask();

  titleInput.value = "",
  dueinput.value = ""
}

function DeleteTask(id){
  tasks = tasks.filter(function(task){
    if(task.id != id){
      return true;
    }
    else{
      return false;
    }
  })

  saveTask();
  renderTask();
}

function startEdit(id){

  let task = tasks.find(function(t){
    return t.id == id;
  })

  if(!task){
    return;
  }

  editingId = id;

  document.getElementById("edit-title").value = task.title;
  document.getElementById("edit-due").value = task.due;

  document.getElementById("edit-row").classList.add("active");

}

function saveEdit(){
  let newTitle = document.getElementById("edit-title").value.trim();
  let newDue = document.getElementById("edit-due").value;

  if(newTitle == ""){
    alert("Title canot be empty");
    return;
  }

  tasks = tasks.map(function(task){
    if(task.id === editingId){

      return {
        id:task.id,
        title: newTitle,
        due: newDue
      }
    }
    else{
      return task;
    }
  });

  saveTask();
  cancleEdit();
  renderTask();
}

