import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email : String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {

  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
  }
`

export default typeDefs;