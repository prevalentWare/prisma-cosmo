import prisma from 'config/prisma';

const RoleResolvers = {
  Role: {
    users: async (parent, _) => {
      return await prisma.user.findMany({
        where: {
          role: {
            is: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
    pages: async (parent, _) => {
      return await prisma.page.findMany({
        where: {
          roles: {
            some: {
              id: {
                equals: parent.id,
              },
            },
          },
        },
      });
    },
  },
  Query: {
    getRoles: async () => {
      return await prisma.role.findMany({});
    },
    getRole: async (_, args) => {
      return await prisma.role.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createRole: async (_, args) => {
      return await prisma.role.create({
        data: { ...args.data },
      });
    },
    updateRole: async (_, args) => {
      return await prisma.role.update({
        where: {
          id: args.where.id,
        },
        data: { ...args.data },
      });
    },
    deleteRole: async (_, args) => {
      return await prisma.role.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { RoleResolvers };
