import { gql } from 'apollo-server-micro';

const TestTypes = gql`
  type Test {
    id: ID!
    user: User!
    userId: String!
  }

  type Query {
    getTests: [Test]
    getTest(id: String!): Test
  }

  input InputCreateTest {
    userId: String!
  }

  input InputWhereTest {
    id: String!
  }

  input InputUpdateTest {
    userId: String
  }

  type Mutation {
    createTest(data: InputCreateTest): Test

    updateTest(where: InputWhereTest!, data: InputUpdateTest): Test

    deleteTest(where: InputWhereTest!): Test
  }
`;
export { TestTypes };
