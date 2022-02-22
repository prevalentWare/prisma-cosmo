import { gql } from 'apollo-server-micro';

const GQLEnums = gql`
  enum Enum_RoleName {
    Admin
    Dev
  }
`;

export { GQLEnums };
