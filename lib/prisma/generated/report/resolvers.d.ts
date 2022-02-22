declare const ReportResolvers: {
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
};
export { ReportResolvers };
