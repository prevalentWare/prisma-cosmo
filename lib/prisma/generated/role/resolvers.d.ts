declare const RoleResolvers: {
    Role: {
        users: (parent: any, _: any) => Promise<import(".prisma/client").User[]>;
        pages: (parent: any, _: any) => Promise<import(".prisma/client").Page[]>;
    };
    Query: {
        getRoles: () => Promise<import(".prisma/client").Role[]>;
        getRole: (_: any, args: any) => Promise<import(".prisma/client").Role>;
    };
    Mutation: {
        createRole: (_: any, args: any) => Promise<import(".prisma/client").Role>;
        updateRole: (_: any, args: any) => Promise<import(".prisma/client").Role>;
        deleteRole: (_: any, args: any) => Promise<import(".prisma/client").Role>;
    };
};
export { RoleResolvers };
