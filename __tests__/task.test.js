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
