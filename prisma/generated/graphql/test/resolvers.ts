import prisma from 'config/prisma';

const TestResolvers = {
  Test: {
    user: async (parent, _) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
    },
  },
  Query: {
    getTests: async () => {
      return await prisma.test.findMany({});
    },
    getTest: async (_, args) => {
      return await prisma.test.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createTest: async (_, args) => {
      return await prisma.test.create({
        data: { ...args.data },
      });
    },
    updateTest: async (_, args) => {
      return await prisma.test.update({
        where: {
          id: args.where.id,
        },
        data: { ...args.data },
      });
    },
    deleteTest: async (_, args) => {
      return await prisma.test.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { TestResolvers };
