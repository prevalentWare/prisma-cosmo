declare const UserResolvers: {
    User: {
        profile: (parent: any, _: any) => Promise<import(".prisma/client").Profile>;
        role: (parent: any, _: any) => Promise<import(".prisma/client").Role>;
        isDeveloperOf: (parent: any, _: any) => Promise<import(".prisma/client").Project[]>;
        reports: (parent: any, _: any) => Promise<import(".prisma/client").Report[]>;
        tests: (parent: any, _: any) => Promise<import(".prisma/client").Test>;
    };
    Query: {
        getUsers: () => Promise<import(".prisma/client").User[]>;
        getUser: (_: any, args: any) => Promise<import(".prisma/client").User>;
    };
    Mutation: {
        createUser: (_: any, args: any) => Promise<import(".prisma/client").User>;
        updateUser: (_: any, args: any) => Promise<import(".prisma/client").User>;
        deleteUser: (_: any, args: any) => Promise<import(".prisma/client").User>;
    };
};
export { UserResolvers };
