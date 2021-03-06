const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGODB_URI } = require('./config');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongo DB Connected!');
    return server.listen();
  })
  .then(({ url }) => {
    console.log(`🚀 Launching Server at ${url}`);
  });
