declare const PageResolvers: {
    Page: {
        roles: (parent: any, _: any) => Promise<import(".prisma/client").Role[]>;
    };
    Query: {
        getPages: () => Promise<import(".prisma/client").Page[]>;
        getPage: (_: any, args: any) => Promise<import(".prisma/client").Page>;
    };
    Mutation: {
        createPage: (_: any, args: any) => Promise<import(".prisma/client").Page>;
        updatePage: (_: any, args: any) => Promise<import(".prisma/client").Page>;
        deletePage: (_: any, args: any) => Promise<import(".prisma/client").Page>;
    };
};
export { PageResolvers };
