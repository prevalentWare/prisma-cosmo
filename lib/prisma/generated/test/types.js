"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTypes = void 0;
var apollo_server_micro_1 = require("apollo-server-micro");
var TestTypes = (0, apollo_server_micro_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Test {\n    id: ID!\n    user: User!\n    userId: String!\n  }\n\n  type Query {\n    getTests: [Test]\n    getTest(id: String!): Test\n  }\n\n  input InputCreateTest {\n    userId: String!\n  }\n\n  input InputWhereTest {\n    id: String!\n  }\n\n  input InputUpdateTest {\n    userId: String\n  }\n\n  type Mutation {\n    createTest(data: InputCreateTest): Test\n\n    updateTest(where: InputWhereTest!, data: InputUpdateTest): Test\n\n    deleteTest(where: InputWhereTest!): Test\n  }\n"], ["\n  type Test {\n    id: ID!\n    user: User!\n    userId: String!\n  }\n\n  type Query {\n    getTests: [Test]\n    getTest(id: String!): Test\n  }\n\n  input InputCreateTest {\n    userId: String!\n  }\n\n  input InputWhereTest {\n    id: String!\n  }\n\n  input InputUpdateTest {\n    userId: String\n  }\n\n  type Mutation {\n    createTest(data: InputCreateTest): Test\n\n    updateTest(where: InputWhereTest!, data: InputUpdateTest): Test\n\n    deleteTest(where: InputWhereTest!): Test\n  }\n"])));
exports.TestTypes = TestTypes;
var templateObject_1;
