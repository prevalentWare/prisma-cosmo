export declare const resolvers: ({
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
} | {
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
} | {
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
} | {
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
} | {
    Report: {
        project: (parent: any, _: any) => Promise<import(".prisma/client").Project>;
        user: (parent: any, _: any) => Promise<import(".prisma/client").User>;
    };
    Query: {
        getReports: () => Promise<import(".prisma/client").Report[]>;
        getReport: (_: any, args: any) => Promise<import(".prisma/client").Report>;
    };
    Mutation: {
        createReport: (_: any, args: any) => Promise<import(".prisma/client").Report>;
        updateReport: (_: any, args: any) => Promise<import(".prisma/client").Report>;
        deleteReport: (_: any, args: any) => Promise<import(".prisma/client").Report>;
    };
} | {
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
} | {
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
} | {
    Test: {
        user: (parent: any, _: any) => Promise<import(".prisma/client").User>;
    };
    Query: {
        getTests: () => Promise<import(".prisma/client").Test[]>;
        getTest: (_: any, args: any) => Promise<import(".prisma/client").Test>;
    };
    Mutation: {
        createTest: (_: any, args: any) => Promise<import(".prisma/client").Test>;
        updateTest: (_: any, args: any) => Promise<import(".prisma/client").Test>;
        deleteTest: (_: any, args: any) => Promise<import(".prisma/client").Test>;
    };
})[];
