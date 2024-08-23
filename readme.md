# Task Tracker

## Este proyecto esta basado en los proyectos del Backend Roadmap de [Roadmap.sh](https://roadmap.sh/projects/task-tracker)

Este proyecto nos ayudará a practicar nuestras habilidades de programación, incluyendo el manejo del sistema de archivos(fs), manejar las entradas del usuario y la construcción de un CLI simple.

## Ejecucion / Execute

Clona el Repositorio / Clone the repo

Para validar el archivo de Test hecho con Jest Puedes ejecutar el siguiente comando :  
To validate the Jest Test file You can run the following command:

```bash 
npm test 
```

### Agregar tarea / Add a Task in the Json File

Para crear una nueva tarea utilizaremos el siguiente comando / To create new task in the Json file you can run the following command:

```bash
node index.js add "Some Task"
```

### Agregar tarea / Add a Task in the Json File

Para crear una nueva tarea utilizaremos el siguiente comando / To create new task in the Json file you can run the following command:

```bash
node index.js add "Some Task"
```

### Actualizar una tarea / Update a Task in the Json File

Para actualizar una tarea existente utilizaremos el siguiente comando / To update a task in the Json file you can run the following command:

```bash
node index.js update 235 "Buy milk"
```

### Eliminar una tarea / Delete a Task in the Json File

Para eliminar una tarea existente utilizaremos el siguiente comando / To delete a task in the Json file you can run the following command:

```bash
node index.js delete 234
```

### Marcar una tarea en progreso o terminada / Marking a task as in progress or done in the Json File 

Para actualizar el Status de una tarea existente utilizaremos el siguiente comando / To update the status to the task in the Json file you can run the following command:

```bash
node index.js mark-done 235 
node index.js mark-in-progress 236 
```

### Listar todas las tareas / Listing all task

Para listar todas las tareas usaremos el siguiente comando / To listing all task you can run the following command:

```bash
node index.js list
```

### Listar las tareas por status / Listing tasks by status

Para listar por status usaremos el siguiente comando / To listing tasks by status you can run the following command:

```bash
node index.js list done
node index.js list todo
node index.js list in-progress
```

## Como Hacerlo
Si quieres realizar este proyecto paso a paso, consulta el archivo `steps.md` ahi encontraras paso a paso como abordar los requisitos y limitaciones del proyecto y la logica que utilice.


## Requisitos

La aplicación debe correr desde el CLI, aceptar los argumentos y acciones que el usuario proporcione, y almacene las tareas en formato JSON. El usuario podria:

- Agregar, Actualizar y Borrar Tareas
- Marcar una tarea en proceso o finalizada
- Listar todas las tareas
- Listar todas las tareas finalizadas
- Listar todas las tareas pendientes
- Listar todas las tareas en proceso

## Limitaciones

A continuación se presentan algunas limitaciones que debes considerar:

- Puedes usar cualquier lenguaje de programación para crear el proyecto
- Utilice argumentos en la línea de comandos para aceptar los datos que proporcione el usuario
- Usa un archivo JSON para almacenar las tareas en el directorio actual
- El archivo JSON debe ser creado si no existe
- Usa el sistema de archivos(fs) nativo de tu lenguaje de programación para interactuar con el JSON
- No uses librerías externas o frameworks para construir tu proyecto
- Asegurate de manejar errores

## Ejemplos

Comandos de ejemplo

```bash
# Adding a new task
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1

# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress
```

## Task Properties
Las tareas deben tener las siguientes propiedades:

- id: Identificador único para tareas 
- description: Descripción corta de tareas
- status: El estatus de una tarea (todo, in-progress, done)
- createdAt: La fecha y hora en la que la tarea fue creada
- updatedAt: La fecha y hora cuando la tarea fue actualizada

Asegúrate de que las propiedades se guarden en el archivo JSON al hacer cualquier operación CRUD

## Testing
- Pruebe cada característica de forma individual para asegurarse que funcione como debería. Revisa el archivo JSON para verificar que las tareas se almacenen correctamente
- Depura cualquier problema que surja durante el desarrollo


