import prisma from 'config/prisma';

const UserResolvers = {
  User: {
    profile: async (parent, _) => {
      return await prisma.profile.findUnique({
        where: {
          userId: parent.id,
        },
      });
    },
    role: async (parent, _) => {
      return await prisma.role.findUnique({
        where: {
          id: parent.roleId,
        },
      });
    },
    isDeveloperOf: async (parent, _) => {
      return await prisma.project.findMany({
        where: {
          developers: {
            some: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
    reports: async (parent, _) => {
      return await prisma.report.findMany({
        where: {
          user: {
            is: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
    tests: async (parent, _) => {
      return await prisma.test.findUnique({
        where: {
          userId: parent.id,
        },
      });
    },
  },
  Query: {
    getUsers: async () => {
      return await prisma.user.findMany({});
    },
    getUser: async (_, args) => {
      return await prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createUser: async (_, args) => {
      return await prisma.user.create({
        data: {
          ...args.data,
          emailVerified: new Date(args.data.emailVerified).toISOString(),
        },
      });
    },
    updateUser: async (_, args) => {
      return await prisma.user.update({
        where: {
          id: args.where.id,
        },
        data: {
          ...args.data,
          ...(args.data.emailVerified && {
            emailVerified: new Date(args.data.emailVerified).toISOString(),
          }),
        },
      });
    },
    deleteUser: async (_, args) => {
      return await prisma.user.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { UserResolvers };
