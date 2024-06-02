document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');

    // Base URL of the deployed back-end server
    const API_URL = 'https://cipherbytee-9e4jug3s1-aryankumawat91s-projects.vercel.app';

    async function fetchTasks() {
        const response = await fetch(`${API_URL}/tasks`);
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
            const response = await fetch(`${API_URL}/tasks`, {
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
        await fetch(`${API_URL}/tasks/${id}`, {
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

