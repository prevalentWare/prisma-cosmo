import prisma from 'config/prisma';

const ProfileResolvers = {
  Profile: {
    user: async (parent, _) => {
      return await prisma.user.findUnique({
        where: {
          id: parent.userId,
        },
      });
    },
  },
  Query: {
    getProfiles: async () => {
      return await prisma.profile.findMany({});
    },
    getProfile: async (_, args) => {
      return await prisma.profile.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    createProfile: async (_, args) => {
      return await prisma.profile.create({
        data: { ...args.data },
      });
    },
    updateProfile: async (_, args) => {
      return await prisma.profile.update({
        where: {
          id: args.where.id,
        },
        data: { ...args.data },
      });
    },
    deleteProfile: async (_, args) => {
      return await prisma.profile.delete({
        where: {
          id: args.where.id,
        },
      });
    },
  },
};

export { ProfileResolvers };
