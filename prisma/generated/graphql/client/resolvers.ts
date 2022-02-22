import prisma from 'config/prisma';

const ClientResolvers = {
  Client: {
    projects: async (parent, _) => {
      return await prisma.project.findMany({
        where: {
          client: {
            is: {
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
    getClients: async () => {
      return await prisma.client.findMany({});
    },
    getClient: async (_, args) => {
      return await prisma.client.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createClient: async (_, args) => {
      return await prisma.client.create({
        data: { ...args.data },
      });
    },
    updateClient: async (_, args) => {
      return await prisma.client.update({
        where: {
          id: args.where.id,
        },
        data: { ...args.data },
      });
    },
    deleteClient: async (_, args) => {
      return await prisma.client.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { ClientResolvers };
