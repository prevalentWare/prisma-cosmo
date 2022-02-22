import prisma from 'config/prisma';

const ProjectResolvers = {
  Project: {
    client: async (parent, _) => {
      return await prisma.client.findUnique({
        where: {
          id: parent.clientId,
        },
      });
    },
    developers: async (parent, _) => {
      return await prisma.user.findMany({
        where: {
          isDeveloperOf: {
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
          project: {
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
    getProjects: async () => {
      return await prisma.project.findMany({});
    },
    getProject: async (_, args) => {
      return await prisma.project.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createProject: async (_, args) => {
      return await prisma.project.create({
        data: {
          ...args.data,
          dueDate: new Date(args.data.dueDate).toISOString(),
        },
      });
    },
    updateProject: async (_, args) => {
      return await prisma.project.update({
        where: {
          id: args.where.id,
        },
        data: {
          ...args.data,
          ...(args.data.dueDate && {
            dueDate: new Date(args.data.dueDate).toISOString(),
          }),
        },
      });
    },
    deleteProject: async (_, args) => {
      return await prisma.project.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { ProjectResolvers };
