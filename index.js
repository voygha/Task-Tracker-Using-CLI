// Destructurar las funciones que vienen de task.js
const { addTask, updateTask, deleteTask, updateStatus, listTasks } = require('./task');

const args = process.argv.slice(2);
const command = args[0];
const taskId = args[1];
const taskDescription = args.slice(1).join(' ');

switch (command) {
    case 'add':
        const addResult = addTask(taskDescription);
        console.log(addResult);
        break;
    case 'update':
        const updateResult = updateTask(taskId, taskDescription);
        console.log(updateResult);
        break;
    case 'delete':
        const deleteResult = deleteTask(taskId);
        console.log(deleteResult);
        break;
    case 'mark-in-progress':
        const inProgressResult = updateStatus(taskId, 'in-progress');
        console.log(inProgressResult);
        break;
    case 'mark-done':
        const doneResult = updateStatus(taskId, 'done');
        console.log(doneResult);
        break;
    case 'list':
        const tasks = listTasks(taskId);
        console.log(tasks.length ? tasks : 'No hay tareas que mostrar.');
        break;
    default:
        console.log('Comando no reconocido');
}
