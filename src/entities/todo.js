const logger = require('../utils/logger');

const collectionName = 'todos';

let collection;

module.exports = {
    async createCollection(db) {
        try {
            const collections = await db.collections();
            if (!collections.map((c) => c.s.namespace.collection).includes(collectionName)) {
                collection = await db.createCollection(collectionName);
            } else {
                collection = await db.collection('todos');
            }
        } catch (err) {
            logger.error(err);
            throw err;
        }

        try {
            await db.command({
                collMod: collectionName,
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: [
                            '_id',
                            'name',
                        ],
                        additionalProperties: false,
                        properties: {
                            _id: {
                                bsonType: 'objectId',
                            },
                            name: {
                                bsonType: 'string',
                            },
                            status: {
                                bsonType: 'string',
                                enum: ['ToDo', 'Done'],
                            },
                        },
                    },
                },
                validationLevel: 'strict',
                validationAction: 'error',
            });
        } catch (err) {
            throw new Error(`Error create collection ${collectionName}: ${err}`);
        }

        try {
            await collection.createIndex({ _id: 1 });
            await collection.createIndex({ name: 1 }, { unique: true });
        } catch (err) {
            throw new Error(`Error add index collection  ${collectionName}: ${err}`);
        }
        logger.info(`Collection ${collectionName} created/updated!`);
    },
    getCollection() {
        return collection;
    },
};
