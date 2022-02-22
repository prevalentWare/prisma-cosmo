import { gql } from 'apollo-server-micro';

const ClientTypes = gql`
  type Client {
    id: ID!
    name: String!
    projects: [Project]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    getClients: [Client]
    getClient(id: String!): Client
  }

  input InputCreateClient {
    name: String!
  }

  input InputWhereClient {
    id: String!
  }

  input InputUpdateClient {
    name: String
  }

  type Mutation {
    createClient(data: InputCreateClient): Client

    updateClient(where: InputWhereClient!, data: InputUpdateClient): Client

    deleteClient(where: InputWhereClient!): Client
  }
`;
export { ClientTypes };
