const ObjectId = require('bson-objectid');
const ToDoEntity = require('./entities/todo');
const { logger } = require('./utils');

async function createToDo(_, { name }) {
    let ToDoCollection;
    try {
        ToDoCollection = await ToDoEntity.getCollection();
    } catch (error) {
        logger.error(error);
    }
    const todo = {
        name,
        status: 'ToDo',
    };
    try {
        await ToDoCollection.insertOne(todo);
        logger.info('inserted', todo);
    } catch (error) {
        logger.error(error);
    }
    return todo;
}

async function list() {
    let ToDoCollection;
    try {
        ToDoCollection = await ToDoEntity.getCollection();
    } catch (error) {
        logger.error(error);
    }
    let todos = [];
    try {
        todos = await ToDoCollection.find({}).toArray();
    } catch (error) {
        logger.error(error);
    }
    return todos;
}
async function toggleStatus(_, { _id }) {
    let ToDoCollection;
    try {
        ToDoCollection = await ToDoEntity.getCollection();
    } catch (error) {
        logger.error(error);
    }
    let todo;
    try {
        todo = await ToDoCollection.findOne({ _id: ObjectId(_id) });
    } catch (error) {
        logger.error(error);
    }
    const newStatus = todo.status === 'ToDo' ? 'Done' : 'ToDo';
    try {
        await ToDoCollection.update({ _id: ObjectId(_id) }, {
            $set: {
                status: newStatus,
            },
        });
    } catch (error) {
        logger.error(error);
    }

    return { ...todo, status: newStatus };
}

async function deleteTodo(_, { _id }) {
    let ToDoCollection;
    try {
        ToDoCollection = await ToDoEntity.getCollection();
    } catch (error) {
        logger.error(error);
    }
    try {
        await ToDoCollection.remove({ _id: ObjectId(_id) });
    } catch (error) {
        logger.error(error);
    }

    return { ok: true };
}

module.exports = {
    Query: {
        todos: list,
    },
    Mutation: {
        createToDo,
        toggleStatus,
        deleteTodo,
    },
};
