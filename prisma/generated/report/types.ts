import { gql } from 'apollo-server-micro';

const ReportTypes = gql`
  type Report {
    id: ID!
    timeSpent: Int!
    date: DateTime!
    comment: String!
    project: Project!
    projectId: String!
    user: User!
    userId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    getReports: [Report]
    getReport(id: String!): Report
  }

  input InputCreateReport {
    timeSpent: Int!
    date: DateTime!
    comment: String!
    projectId: String!
    userId: String!
  }

  input InputWhereReport {
    id: String!
  }

  input InputUpdateReport {
    timeSpent: Int
    date: DateTime
    comment: String
    projectId: String
    userId: String
  }

  type Mutation {
    createReport(data: InputCreateReport): Report

    updateReport(where: InputWhereReport!, data: InputUpdateReport): Report

    deleteReport(where: InputWhereReport!): Report
  }
`;
export { ReportTypes };
