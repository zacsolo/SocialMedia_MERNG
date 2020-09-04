import React from 'react';
import App from './App';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
