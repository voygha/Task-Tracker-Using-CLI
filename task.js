const fs = require('node:fs');
const path = require('node:path');

// Path del archivo JSON
const taskFilePath = path.join(__dirname,'task.json');

//Asegurarse de que el archivo JSON exista
if( !fs.existsSync(taskFilePath)) {
    fs.writeFileSync(taskFilePath, JSON.stringify([]));
}


function loadTasks(){
    const data = fs.readFileSync(taskFilePath);
    return JSON.parse(data);
}

function saveTasks(task){
    fs.writeFileSync(taskFilePath, JSON.stringify(task,null,2));
}

function addTask(description) {
    //Cargamos el JSON
    const tasks = loadTasks();
    // Creamos el objeto que guardara una nueva tarea
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date()
    };
    tasks.push(newTask);
    //Hacemos el llamado a saveTask para guardar la tarea
    saveTasks(tasks);
    console.log(`Tarea agregada exitosamente (ID: ${newTask.id})`);
}

function updateTask(id, newDescription) {
    const tasks = loadTasks();
    //busca la tarea por el id
    const task = tasks.find(task => task.id == id);
    //si la tarea fue encontra => entonces actualiza la descripcion
    if (task) {
        task.description = newDescription;
        //Guarda la fecha de actualizacion
        task.updatedAt = new Date();
        //Guarda la tarea actualizada por el id
        saveTasks(tasks);
        console.log(`Tarea actualizada exitosamente (ID: ${id})`);
    } else {
        console.log(`Tarea con ID: ${id} no encontrada`);
    }
}

function deleteTask(id) {
    //carga las entradas del JSON
    let tasks = loadTasks();
    // guarda la lista de tareas despues de ser filtradas omitiendo el id que se solicita eliminar
    tasks = tasks.filter(task => task.id != id);
    //Guarda en el JSON la lista actualizada omitiendo el id proporcionado en caso de que exista
    saveTasks(tasks);
    console.log(`Tarea eliminada exitosamente (ID: ${id})`);
}

function updateStatus(id, newStatus) {
    //Carga las tareas del JSON
    const tasks = loadTasks();
    // busca si existe la tarea conforme al id proporcionado
    const task = tasks.find(task => task.id == id);
    //si la tarea existe => actualiza el estado conforme al switch
    if (task) {
        task.status = newStatus;
        task.updatedAt = new Date();
        saveTasks(tasks);
        console.log(`Tarea actualizada a ${newStatus} (ID: ${id})`);
    } else {
        console.log(`Tarea con ID: ${id} no encontrada`);
    }
}

function listTasks(status = '') {
    // Se lee el JSON
    const tasks = loadTasks();
    // Si hay status busca todas las tareas que coincidan con el status
    // Si no hay status devuelve todas las tareas que se tengan guardadas en el JSON
    const filteredTasks = status ? tasks.filter(task => task.status === status) : tasks;
    
    // En lugar de solo imprimir, devolvemos las tareas filtradas
    return filteredTasks.length ? filteredTasks : [];
}

//exportar las funciones al index
module.exports = { addTask, updateTask, deleteTask, updateStatus, listTasks };