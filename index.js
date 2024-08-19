//Destructurar las funciones que vienen task.js
const { addTask, updateTask, deleteTask, updateStatus, listTasks } = require('./task');

const args = process.argv.slice(2);
const command = args[0];
const taskId =args[1];
const taskDescription = args.slice(1).join(' ');

switch(command){
    case 'add': 
        addTask(taskDescription);
        break;
    case 'update':
        updateTask(taskId, taskDescription);
        break;
    case 'delete':
        deleteTask(taskId);
        break;
    case 'mark-in-progress':
        updateStatus(taskId, 'in-progress');
        break;
    case 'mark-done':
        updateStatus(taskId, 'done');
        break;
    case 'list':
        listTasks(taskId);
        break;
    default:
        console.log('Comando no reconocido');
}



