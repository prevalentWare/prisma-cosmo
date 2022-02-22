declare const ProfileResolvers: {
    Profile: {
        user: (parent: any, _: any) => Promise<import(".prisma/client").User>;
    };
    Query: {
        getProfiles: () => Promise<import(".prisma/client").Profile[]>;
        getProfile: (_: any, args: any) => Promise<import(".prisma/client").Profile>;
    };
    Mutation: {
        createProfile: (_: any, args: any) => Promise<import(".prisma/client").Profile>;
        updateProfile: (_: any, args: any) => Promise<import(".prisma/client").Profile>;
        deleteProfile: (_: any, args: any) => Promise<import(".prisma/client").Profile>;
    };
};
export { ProfileResolvers };
