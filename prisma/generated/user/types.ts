import { gql } from 'apollo-server-micro';

const UserTypes = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    image: String
    emailVerified: DateTime
    profile: Profile
    role: Role!
    roleId: String!
    isDeveloperOf: [Project]
    reports: [Report]
    createdAt: DateTime!
    updatedAt: DateTime!
    tests: Test
  }

  type Query {
    getUsers: [User]
    getUser(id: String!): User
  }

  input InputCreateUser {
    email: String!
    name: String!
    image: String
    emailVerified: DateTime
    roleId: String!
  }

  input InputWhereUser {
    id: String!
  }

  input InputUpdateUser {
    email: String
    name: String
    image: String
    emailVerified: DateTime
    roleId: String
  }

  type Mutation {
    createUser(data: InputCreateUser): User

    updateUser(where: InputWhereUser!, data: InputUpdateUser): User

    deleteUser(where: InputWhereUser!): User
  }
`;
export { UserTypes };
