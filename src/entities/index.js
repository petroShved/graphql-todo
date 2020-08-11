const TodoEntity = require('./todo');
const logger = require('../utils/logger');

async function createCollections(db) {
    try {
        await TodoEntity.createCollection(db);
    } catch (err) {
        logger.error(err);
    }
}

module.exports = {
    createCollections,
};
