
let tasks = JSON.parse(localStorage.getItem('actionhub-tasks') || '[]');


let currentFilter = 'all';


let editingId = null;



function saveTasks() {
  localStorage.setItem('actionhub-tasks', JSON.stringify(tasks));
}



function getToday() {
  return new Date().toISOString().split('T')[0];
}



function getStatus(dueDate) {
  if (!dueDate) return 'upcoming';

  const today = getToday();

  if (dueDate < today) return 'overdue';
  if (dueDate === today) return 'today';
  return 'upcoming';
}



function addTask() {
  const titleInput = document.getElementById('task-input');
  const dueInput = document.getElementById('due-input');

  const title = titleInput.value.trim();
  const due = dueInput.value;

  
  if (!title) {
    alert('Please enter a task title.');
    return;
  }

  
  const newTask = {
    id: Date.now(),  
    title: title,
    due: due
  };

  
  tasks.unshift(newTask);

 
  saveTasks();
  renderTasks();

  
  titleInput.value = '';
  dueInput.value = '';
}



function deleteTask(id) {
  
  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}



function startEdit(id) {
  
  const task = tasks.find(function(t) {
    return t.id === id;
  });

  if (!task) return;

  
  editingId = id;

  
  document.getElementById('edit-title').value = task.title;
  document.getElementById('edit-due').value = task.due || '';

  
  document.getElementById('edit-row').classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function saveEdit() {
  const newTitle = document.getElementById('edit-title').value.trim();
  const newDue = document.getElementById('edit-due').value;

  if (!newTitle) {
    alert('Title cannot be empty.');
    return;
  }

  
  tasks = tasks.map(function(task) {
    if (task.id === editingId) {
      return { id: task.id, title: newTitle, due: newDue };
    }
    return task;
  });

  saveTasks();
  cancelEdit();   
  renderTasks();  
}



function cancelEdit() {
  editingId = null;

  
  document.getElementById('edit-title').value = '';
  document.getElementById('edit-due').value = '';
  document.getElementById('edit-row').classList.remove('active');
}



function setFilter(filter, clickedButton) {
  currentFilter = filter;

  
  const allButtons = document.querySelectorAll('.filter-btn');
  allButtons.forEach(function(btn) {
    btn.classList.remove('active');
  });
  clickedButton.classList.add('active');

  renderTasks();
}



function renderTasks() {
  const today = getToday();

  
  const totalCount    = tasks.length;
  const todayCount    = tasks.filter(t => t.due === today).length;
  const upcomingCount = tasks.filter(t => t.due && t.due > today).length;
  const overdueCount  = tasks.filter(t => t.due && t.due < today).length;

  
  document.getElementById('count-all').textContent      = totalCount;
  document.getElementById('count-today').textContent    = todayCount;
  document.getElementById('count-upcoming').textContent = upcomingCount;
  document.getElementById('count-overdue').textContent  = overdueCount;

  
  let filteredTasks;

  if (currentFilter === 'today') {
    filteredTasks = tasks.filter(t => t.due === today);

  } else if (currentFilter === 'upcoming') {
    filteredTasks = tasks.filter(t => t.due && t.due > today);

  } else if (currentFilter === 'overdue') {
    filteredTasks = tasks.filter(t => t.due && t.due < today);

  } else {
    filteredTasks = tasks; 
  }

  const taskList = document.getElementById('task-list');
  const emptyMsg = document.getElementById('empty-msg');

  
  if (filteredTasks.length === 0) {
    taskList.innerHTML = '';
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';

  
  let html = '';

  filteredTasks.forEach(function(task) {
    const status = getStatus(task.due);

    
    let dueClass = '';
    if (status === 'overdue') dueClass = 'overdue-text';
    if (status === 'today')   dueClass = 'today-text';

    
    const dueDisplay = task.due ? 'Due: ' + task.due : 'No due date';

    html += `
      <div class="task-card ${status}">
        <div class="task-info">
          <div class="task-title">${task.title}</div>
          <div class="task-due ${dueClass}">${dueDisplay}</div>
        </div>
        <div class="task-actions">
          <button class="edit-btn" onclick="startEdit(${task.id})">✏ Edit</button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">🗑 Delete</button>
        </div>
      </div>
    `;
  });

  taskList.innerHTML = html;
}



document.getElementById('task-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addTask();
});

document.getElementById('edit-title').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') saveEdit();
});



renderTasks();