import { gql } from 'apollo-server-micro';

const PageTypes = gql`
  type Page {
    id: ID!
    name: String!
    path: String!
    roles: [Role]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    getPages: [Page]
    getPage(id: String!): Page
  }

  input InputCreatePage {
    name: String!
    path: String!
  }

  input InputWherePage {
    id: String!
  }

  input InputUpdatePage {
    name: String
    path: String
  }

  type Mutation {
    createPage(data: InputCreatePage): Page

    updatePage(where: InputWherePage!, data: InputUpdatePage): Page

    deletePage(where: InputWherePage!): Page
  }
`;
export { PageTypes };
