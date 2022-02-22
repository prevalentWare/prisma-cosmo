import { gql } from 'apollo-server-micro';

const ProfileTypes = gql`
  type Profile {
    id: ID!
    phone: String!
    address: String!
    user: User!
    userId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    getProfiles: [Profile]
    getProfile(id: String!): Profile
  }

  input InputCreateProfile {
    phone: String!
    address: String!
    userId: String!
  }

  input InputWhereProfile {
    id: String!
  }

  input InputUpdateProfile {
    phone: String
    address: String
    userId: String
  }

  type Mutation {
    createProfile(data: InputCreateProfile): Profile

    updateProfile(where: InputWhereProfile!, data: InputUpdateProfile): Profile

    deleteProfile(where: InputWhereProfile!): Profile
  }
`;
export { ProfileTypes };
