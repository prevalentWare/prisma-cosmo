declare const TestResolvers: {
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
};
export { TestResolvers };
