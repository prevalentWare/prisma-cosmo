import { gql } from 'apollo-server-micro';

const RoleTypes = gql`
  type Role {
    id: ID!
    name: Enum_RoleName!
    users: [User]
    pages: [Page]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    getRoles: [Role]
    getRole(id: String!): Role
  }

  input InputCreateRole {
    name: Enum_RoleName!
  }

  input InputWhereRole {
    id: String!
  }

  input InputUpdateRole {
    name: Enum_RoleName
  }

  type Mutation {
    createRole(data: InputCreateRole): Role

    updateRole(where: InputWhereRole!, data: InputUpdateRole): Role

    deleteRole(where: InputWhereRole!): Role
  }
`;
export { RoleTypes };
