# Inicializar el proyecto

```bash
npm init -y
```

## Crea el archivo `index.js`

## Estructura del Proyecto
Dentro del proyecto, tendremos un archivo JSON para almacenar las tareas y un archivo JS para manejar la logica.

- index.js: Archivo Principal donde estara la logica del CLI.
- task.json: Archivo donde se almacenaran las tareas.

## Implementacion

Importacion de modulos necesarios
```javascript
//index.js
const fs = require('fs');
const path = require('path');

// Path al archivo JSON
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Asegúrate de que el archivo JSON exista
if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
}
```

Necesitamos manejar los argumentos que va a recibir nuestro CLI y los comandos o metodos que podemos ejecutar dentro del CLI

```javascript
//index.js
const args = process.argv.slice(2);
const command = args[0];
const taskId = args[1];
const taskDescription = args.slice(1).join(" ");

switch (command) {
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
        listTasks(taskId);  // taskId here represents the status filter (e.g., done, todo, in-progress)
        break;
    default:
        console.log('Comando no reconocido');
}

```

## Cargar el archivo JSON
Necesitamos cargar el archivo JSON para implementar las funciones CRUD

```javascript
function loadTasks() {
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data);
}

```

## Guardar cambios en el JSON
Esta funcion nos va a servir para guardar una nueva tarea o actualizar una existente
```javascript
function saveTask(task){
    fs.writeFileSync(taskFilePath, JSON.stringify(task,null,2));
}
```

## Agregar una tarea desde el CLI
Creamos la funcion addTask la cual guardara una tarea con:
- id
- description
- status
- createdAt
- updatedAt

```javascript
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
```

## Actualizar tarea
Creamos la funcion updateTask, la cual recibe 2 parametros, el id y la nueva descripcion, podria recibir mas parametros como el titulo, para este ejemplo con la descripcion es suficiente

```javascript
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
```

## Eliminar tareas
Recibe el id de la tarea, lo busca y lo borra

```javascript
function deleteTask(id) {
    //carga las entradas del JSON
    let tasks = loadTasks();
    // guarda la lista de tareas despues de ser filtradas omitiendo el id que se solicita eliminar
    tasks = tasks.filter(task => task.id != id);
    //Guarda en el JSON la lista actualizada omitiendo el id proporcionado en caso de que exista
    saveTasks(tasks);
    console.log(`Tarea eliminada exitosamente (ID: ${id})`);
}
```

## Actualizar el status de una tarea
La funcion recibe un id, y llama al switch para actualizar el status conforme al status proporcionado

```javascript
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
```

## Listar todas las tareas 
Podemos pasarle un status vacio como parametro por defecto.
Es decir al ejecutar:
```bash
node index.js list
```
Listaria todas las tareas sin importar el estado

Si agregamos un status como parametro como `done` entonces solo listaria las tareas con este status

```bash
node index.js list done
```

```javascript
//Definimos por defecto el status vacio si no enviamos un parametro
function listTasks(status = '') {
    // Se lee el JSON
    const tasks = loadTasks();
    // Si hay status busca todas las tareas que coincidan con el status
    // Si no hay status devuelve todas las tareas que se tengan guardadas en el JSON
    const filteredTasks = status ? tasks.filter(task => task.status === status) : tasks;
    //Si la busqueda tiene al menos 1 tarea devuelve el objeto de las tareas
    // En lugar de solo imprimir, devolvemos las tareas filtradas
    return filteredTasks.length ? filteredTasks : [];
}
```

Hasta este punto la aplicacion ya esta funcionando y puedes hacer cualquier funcion del CRUD
Ejemplo:
```bash
# Adding a new task
node index.js add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
node index.js update 1 "Buy groceries and cook dinner"
node index.js delete 1

# Marking a task as in progress or done
node index.js mark-in-progress 1
node index.js mark-done 1

# Listing all tasks
node index.js list

# Listing tasks by status
node index.js list done
node index.js list todo
node index.js list in-progress
```

## Separar el CLI de las funciones
Para buenas practicas vamos a separar las funciones del CLI ahora tendremos 2 archivos:
- index.js Aqui ira la logica del CLI
- task.js Aqui iran las funciones CRUD de las tareas


### El archivo `task.js` quedaria asi:

```javascript
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
    //Si la busqueda tiene al menos 1 tarea devuelve el objeto de las tareas
    // Si no tiene ninguna tarea, entonces => imprime mensaje de que no hay tareas 
    // En lugar de solo imprimir, devolvemos las tareas filtradas
    return filteredTasks.length ? filteredTasks : [];
}

//exportar las funciones al index
module.exports = { addTask, updateTask, deleteTask, updateStatus, listTasks };
```


### El archivo `index.js` quedaria de la siguiente forma:
```javascript
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
```

## TEST
Para realizar los test utilizare Jest y SupertTest

### Instalar Dependencias

```bash
npm install --save-dev supertest jest
```

### Configurar Jest
En el `package.json` debes configurar el script de Jest para ser reconocido por el servidor:
```javascript
"scripts": {
    "test": "jest"
  },
```
Crearemos una carpeta __test__
Dentro de la carpeta vamos a crear un archivo llamado `task.test.js`, puedes llamarlo como quieras siempre y cuando termine en `test.js`

### Comenzando a configurar el `task.test.js`

Necesitamos importar las funciones CRUD del task y el fs para manejar el FileSystem

```javascript
const fs = require('fs');
const { addTask, updateTask, deleteTask, updateStatus, listTasks } = require('../task');

// Simula las funciones de file system
jest.mock('fs');
```

### Test General

Creamos el Test General que contendra los test unitarios

```javascript
describe('Pruebas de la CLI de Task Tracker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //Aqui debajo iran los test unitarios
});

```

#### TEST Agregar Tarea
```javascript
describe('Pruebas de la CLI de Task Tracker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //Aqui debajo iran los test unitarios
    //Agregar tarea
    test('Debe agregar una tarea', () => {
        const taskDescription = 'Comprar leche';
        const initialTasks = [
            { id: 1, description: 'Tarea 1', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(initialTasks));
        fs.writeFileSync.mockImplementationOnce((path, data) => {
            const tasks = JSON.parse(data);
            expect(tasks).toContainEqual(expect.objectContaining({ description: taskDescription }));
        });

        addTask(taskDescription);
    });
});
```

### TEST Actualizar Tarea
```javascript
describe('Pruebas de la CLI de Task Tracker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //Aqui debajo iran los test unitarios
    test('Debe actualizar una tarea', () => {
        const taskId = 1;
        const newDescription = 'Comprar leche y pan';
        const initialTasks = [
            { id: taskId, description: 'Comprar leche', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(initialTasks));
        fs.writeFileSync.mockImplementationOnce((path, data) => {
            const tasks = JSON.parse(data);
            expect(tasks).toContainEqual(expect.objectContaining({ id: taskId, description: newDescription }));
        });

        updateTask(taskId, newDescription);
    });
});

```

### TEST Eliminar Tarea
```javascript
describe('Pruebas de la CLI de Task Tracker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //Aqui debajo iran los test unitarios
    test('Debe eliminar una tarea', () => {
        const taskId = 1;
        const initialTasks = [
            { id: taskId, description: 'Comprar leche', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(initialTasks));
        fs.writeFileSync.mockImplementationOnce((path, data) => {
            const tasks = JSON.parse(data);
            expect(tasks).not.toContainEqual(expect.objectContaining({ id: taskId }));
        });

        deleteTask(taskId);
    });
});

```

### TEST Actualizar Status
```javascript
describe('Pruebas de la CLI de Task Tracker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //Aqui debajo iran los test unitarios
    test('Debe actualizar el estado de una tarea', () => {
        const taskId = 1;
        const newStatus = 'in-progress';
        const initialTasks = [
            { id: taskId, description: 'Comprar leche', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(initialTasks));
        fs.writeFileSync.mockImplementationOnce((path, data) => {
            const tasks = JSON.parse(data);
            expect(tasks).toContainEqual(expect.objectContaining({ id: taskId, status: newStatus }));
        });

        updateStatus(taskId, newStatus);
    });
});

```

### TEST Listar tareas
```javascript
describe('Pruebas de la CLI de Task Tracker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //Aqui debajo iran los test unitarios
    test('Debe listar tareas', () => {
        const tasks = [
            { id: 1, description: 'Comprar leche', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(tasks));

        const result = listTasks();

        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('description');
        expect(result[0]).toHaveProperty('status');
    });
});

```

### TEST FINAL
```javascript
const fs = require('fs');
const { addTask, updateTask, deleteTask, updateStatus, listTasks } = require('../task');

// Simula las funciones de file system
jest.mock('fs');

describe('Pruebas de la CLI de Task Tracker', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debe agregar una tarea', () => {
        const taskDescription = 'Comprar leche';
        const initialTasks = [
            { id: 1, description: 'Tarea 1', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(initialTasks));
        fs.writeFileSync.mockImplementationOnce((path, data) => {
            const tasks = JSON.parse(data);
            expect(tasks).toContainEqual(expect.objectContaining({ description: taskDescription }));
        });

        addTask(taskDescription);
    });

    test('Debe actualizar una tarea', () => {
        const taskId = 1;
        const newDescription = 'Comprar leche y pan';
        const initialTasks = [
            { id: taskId, description: 'Comprar leche', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(initialTasks));
        fs.writeFileSync.mockImplementationOnce((path, data) => {
            const tasks = JSON.parse(data);
            expect(tasks).toContainEqual(expect.objectContaining({ id: taskId, description: newDescription }));
        });

        updateTask(taskId, newDescription);
    });

    test('Debe eliminar una tarea', () => {
        const taskId = 1;
        const initialTasks = [
            { id: taskId, description: 'Comprar leche', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(initialTasks));
        fs.writeFileSync.mockImplementationOnce((path, data) => {
            const tasks = JSON.parse(data);
            expect(tasks).not.toContainEqual(expect.objectContaining({ id: taskId }));
        });

        deleteTask(taskId);
    });

    test('Debe actualizar el estado de una tarea', () => {
        const taskId = 1;
        const newStatus = 'in-progress';
        const initialTasks = [
            { id: taskId, description: 'Comprar leche', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(initialTasks));
        fs.writeFileSync.mockImplementationOnce((path, data) => {
            const tasks = JSON.parse(data);
            expect(tasks).toContainEqual(expect.objectContaining({ id: taskId, status: newStatus }));
        });

        updateStatus(taskId, newStatus);
    });

    test('Debe listar tareas', () => {
        const tasks = [
            { id: 1, description: 'Comprar leche', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];

        fs.readFileSync.mockImplementationOnce(() => JSON.stringify(tasks));

        const result = listTasks();

        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('description');
        expect(result[0]).toHaveProperty('status');
    });
});
```

Para revisar el test ejecuta el comando:
```bash
npm run test
```