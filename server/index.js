const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const { createSourceEventStream } = require('graphql');
const mongoose = require('mongoose');

const Post = require('./models/Post');
const { MONGODB_URI } = require('./config');

const typeDefs = gql`
  type Query {
    getPosts: [Post]
  }
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
`;

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const post = await Post.find();
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
