import prisma from 'config/prisma';

const PageResolvers = {
  Page: {
    roles: async (parent, _) => {
      return await prisma.role.findMany({
        where: {
          pages: {
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
    getPages: async () => {
      return await prisma.page.findMany({});
    },
    getPage: async (_, args) => {
      return await prisma.page.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createPage: async (_, args) => {
      return await prisma.page.create({
        data: { ...args.data },
      });
    },
    updatePage: async (_, args) => {
      return await prisma.page.update({
        where: {
          id: args.where.id,
        },
        data: { ...args.data },
      });
    },
    deletePage: async (_, args) => {
      return await prisma.page.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { PageResolvers };
