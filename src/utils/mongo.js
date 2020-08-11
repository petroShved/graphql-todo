const MongoDB = require('mongodb');
const mongodbUri = require('mongodb-uri');
const entities = require('../entities');
const pkg = require('../../package.json');
const config = require('../config');
const logger = require('./logger');

const dbUri = config.mongodbUri;

let db;

module.exports = {

    async connectToServer() {
        try {
            const uriObject = mongodbUri.parse(dbUri);
            const client = await new Promise((resolve, reject) => {
                MongoDB.connect(dbUri, {
                    // poolSize: 5,
                    // ssl: true,
                    // checkServerIdentity: true,
                    noDelay: true,
                    appname: pkg.name,
                    useUnifiedTopology: true,
                }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
            db = client.db(uriObject.database);
            logger.info(`Driver default connection open to ${dbUri}`);
            // Create Collections
            await entities.createCollections(db);
            // Successfully connected
            db.on('fullsetup', () => {
                logger.info(`Driver default connection open to ${dbUri}`);
            });

            // If the connection throws an error
            db.on('error', (err) => {
                logger.error(`Driver default connection error: ${dbUri}`, err);
            });

            // When the connection is closed
            db.on('close', () => {
                logger.error('Driver default connection disconnected');
            });

            // If the Node process ends, close the db connection
            process.on('SIGINT', () => {
                client.close(() => {
                    logger.info('Driver default connection disconnected through app termination');
                    process.exit(0);
                });
            });
        } catch (e) {
            logger.error(e);
        }
    },

    getDb() {
        return db;
    },
};
