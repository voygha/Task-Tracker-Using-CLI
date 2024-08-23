const fs = require('node:fs');
const path = require('node:path');

// Path del archivo JSON
const taskFilePath = path.join(__dirname, 'task.json');

// Asegurarse de que el archivo JSON exista
if (!fs.existsSync(taskFilePath)) {
    fs.writeFileSync(taskFilePath, JSON.stringify([]));
}

function loadTasks() {
    // Leer el archivo JSON
    const data = fs.readFileSync(taskFilePath);
    return JSON.parse(data); // Parsear y devolver las tareas
}

function saveTasks(tasks) {
    // Guardar las tareas en el archivo JSON
    fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
}

function addTask(description) {
    // Cargar las tareas existentes
    const tasks = loadTasks();
    // Crear un objeto para la nueva tarea
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    // Agregar la nueva tarea a la lista
    tasks.push(newTask);
    // Guardar la lista de tareas actualizada
    saveTasks(tasks);
    return `Tarea agregada exitosamente (ID: ${newTask.id})`;
}

function updateTask(id, newDescription) {
    // Cargar las tareas existentes
    const tasks = loadTasks();
    // Buscar la tarea por su ID
    const task = tasks.find(task => task.id == id);
    // Si la tarea existe, actualizar la descripción
    if (task) {
        task.description = newDescription;
        task.updatedAt = new Date(); // Actualizar la fecha de modificación
        saveTasks(tasks); // Guardar la lista de tareas actualizada
        return `Tarea actualizada exitosamente (ID: ${id})`;
    } else {
        return `Tarea con ID: ${id} no encontrada`;
    }
}

function deleteTask(id) {
    // Cargar las tareas existentes
    let tasks = loadTasks();
    const initialLength = tasks.length;
    // Filtrar la lista para eliminar la tarea con el ID proporcionado
    tasks = tasks.filter(task => task.id != id);
    saveTasks(tasks); // Guardar la lista de tareas actualizada
    return tasks.length < initialLength 
        ? `Tarea eliminada exitosamente (ID: ${id})`
        : `Tarea con ID: ${id} no encontrada`;
}

function updateStatus(id, newStatus) {
    // Cargar las tareas existentes
    const tasks = loadTasks();
    // Buscar la tarea por su ID
    const task = tasks.find(task => task.id == id);
    // Si la tarea existe, actualizar el estado
    if (task) {
        task.status = newStatus;
        task.updatedAt = new Date(); // Actualizar la fecha de modificación
        saveTasks(tasks); // Guardar la lista de tareas actualizada
        return `Tarea actualizada a ${newStatus} (ID: ${id})`;
    } else {
        return `Tarea con ID: ${id} no encontrada`;
    }
}

function listTasks(status = '') {
    // Cargar las tareas existentes
    const tasks = loadTasks();
    // Filtrar las tareas por estado si se proporciona, o devolver todas
    const filteredTasks = status ? tasks.filter(task => task.status === status) : tasks;
    return filteredTasks.length ? filteredTasks : []; // Devolver la lista filtrada o vacía
}

// Exportar las funciones para su uso en otros archivos
module.exports = { addTask, updateTask, deleteTask, updateStatus, listTasks };
