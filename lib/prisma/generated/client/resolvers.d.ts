declare const ClientResolvers: {
    Client: {
        projects: (parent: any, _: any) => Promise<import(".prisma/client").Project[]>;
    };
    Query: {
        getClients: () => Promise<import(".prisma/client").Client[]>;
        getClient: (_: any, args: any) => Promise<import(".prisma/client").Client>;
    };
    Mutation: {
        createClient: (_: any, args: any) => Promise<import(".prisma/client").Client>;
        updateClient: (_: any, args: any) => Promise<import(".prisma/client").Client>;
        deleteClient: (_: any, args: any) => Promise<import(".prisma/client").Client>;
    };
};
export { ClientResolvers };
