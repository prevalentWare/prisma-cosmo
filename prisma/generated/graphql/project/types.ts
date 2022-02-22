import { gql } from 'apollo-server-micro';

const ProjectTypes = gql`
  type Project {
    id: ID!
    name: String!
    description: String!
    price: Float!
    dueDate: DateTime!
    client: Client!
    clientId: String!
    developers: [User]
    reports: [Report]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    getProjects: [Project]
    getProject(id: String!): Project
  }

  input InputCreateProject {
    name: String!
    description: String!
    price: Float!
    dueDate: DateTime!
    clientId: String!
  }

  input InputWhereProject {
    id: String!
  }

  input InputUpdateProject {
    name: String
    description: String
    price: Float
    dueDate: DateTime
    clientId: String
  }

  type Mutation {
    createProject(data: InputCreateProject): Project

    updateProject(where: InputWhereProject!, data: InputUpdateProject): Project

    deleteProject(where: InputWhereProject!): Project
  }
`;
export { ProjectTypes };
