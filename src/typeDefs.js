const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    hello: String
    todos: [ToDo!]
  }

  type ToDo {
    _id: ID!,
    name: String!,
    status: String,
  }
  
  type DeleteResponse {
    ok: Boolean!
  }

  type Mutation {
    createToDo(name: String!): ToDo!
    toggleStatus(_id: ID!): ToDo!
    deleteTodo(_id: ID!): DeleteResponse!
  }
`;
