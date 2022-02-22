import prisma from 'config/prisma';

const ReportResolvers = {
  Report: {
    project: async (parent, _) => {
      return await prisma.project.findUnique({
        where: {
          id: parent.projectId,
        },
      });
    },
    user: async (parent, _) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
    },
  },
  Query: {
    getReports: async () => {
      return await prisma.report.findMany({});
    },
    getReport: async (_, args) => {
      return await prisma.report.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createReport: async (_, args) => {
      return await prisma.report.create({
        data: { ...args.data, date: new Date(args.data.date).toISOString() },
      });
    },
    updateReport: async (_, args) => {
      return await prisma.report.update({
        where: {
          id: args.where.id,
        },
        data: {
          ...args.data,
          ...(args.data.date && {
            date: new Date(args.data.date).toISOString(),
          }),
        },
      });
    },
    deleteReport: async (_, args) => {
      return await prisma.report.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { ReportResolvers };
