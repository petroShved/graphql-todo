const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { logger, mongo } = require('./utils');
const { port } = require('./config');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

process.on('unhandledRejection', (reason, p) => {
    logger.error(p, reason);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception: ', err);
});

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

try {
    mongo.connectToServer();
} catch (err) {
    logger.error(err);
}

app.listen({ port }, () => {
    logger.info(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});
