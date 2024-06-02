document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    function addTask(taskText) {
        const taskItem = document.createElement('li');
        const timestamp = new Date().toLocaleString();
        taskItem.textContent = `${taskText} (Added: ${timestamp})`;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete-btn');
        completeButton.addEventListener('click', () => {
            const completionTimestamp = new Date().toLocaleString();
            taskItem.classList.add('completed');
            taskItem.textContent = `${taskText} (Completed: ${completionTimestamp})`;
            completedTaskList.appendChild(taskItem);
            completeButton.remove();
        });

        taskItem.appendChild(completeButton);
        taskList.appendChild(taskItem);
    }
});

//next
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');

    async function fetchTasks() {
        const response = await fetch('http://localhost:5000/tasks');
        const tasks = await response.json();
        tasks.forEach(task => {
            if (task.isCompleted) {
                addTaskToDOM(task, true);
            } else {
                addTaskToDOM(task, false);
            }
        });
    }

    fetchTasks();

    addTaskButton.addEventListener('click', async () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: taskText })
            });
            const task = await response.json();
            addTaskToDOM(task, false);
            taskInput.value = '';
        }
    });

    async function completeTask(id, taskItem) {
        await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT'
        });
        taskItem.classList.add('completed');
        taskItem.textContent += ` (Completed: ${new Date().toLocaleString()})`;
        completedTaskList.appendChild(taskItem);
    }

    function addTaskToDOM(task, isCompleted) {
        const taskItem = document.createElement('li');
        taskItem.textContent = `${task.text} (Added: ${new Date(task.addedAt).toLocaleString()})`;

        if (!isCompleted) {
            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete';
            completeButton.classList.add('complete-btn');
            completeButton.addEventListener('click', () => completeTask(task._id, taskItem));
            taskItem.appendChild(completeButton);
            taskList.appendChild(taskItem);
        } else {
            taskItem.classList.add('completed');
            taskItem.textContent += ` (Completed: ${new Date(task.completedAt).toLocaleString()})`;
            completedTaskList.appendChild(taskItem);
        }
    }
});
