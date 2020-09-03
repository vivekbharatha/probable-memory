const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubSub = new PubSub();

const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubSub }),
});

const app = express();

app.use(morgan('tiny'), cors());

server.applyMiddleware({ app, path: '/' });

mongoose
  .connect(config.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected, starting server...');
    app.port = process.env.PORT || 5000;
    return app.listen({ port: app.port });
  })
  .then((res) => {
    console.log(`Server running at port: ${app.port}`);
  })
  .catch(console.error);
