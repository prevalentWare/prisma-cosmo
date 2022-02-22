declare const ProjectResolvers: {
    Project: {
        client: (parent: any, _: any) => Promise<import(".prisma/client").Client>;
        developers: (parent: any, _: any) => Promise<import(".prisma/client").User[]>;
        reports: (parent: any, _: any) => Promise<import(".prisma/client").Report[]>;
    };
    Query: {
        getProjects: () => Promise<import(".prisma/client").Project[]>;
        getProject: (_: any, args: any) => Promise<import(".prisma/client").Project>;
    };
    Mutation: {
        createProject: (_: any, args: any) => Promise<import(".prisma/client").Project>;
        updateProject: (_: any, args: any) => Promise<import(".prisma/client").Project>;
        deleteProject: (_: any, args: any) => Promise<import(".prisma/client").Project>;
    };
};
export { ProjectResolvers };
