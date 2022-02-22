"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTypes = void 0;
var apollo_server_micro_1 = require("apollo-server-micro");
var ClientTypes = (0, apollo_server_micro_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Client {\n    id: ID!\n    name: String!\n    projects: [Project]\n    createdAt: DateTime!\n    updatedAt: DateTime!\n  }\n\n  type Query {\n    getClients: [Client]\n    getClient(id: String!): Client\n  }\n\n  input InputCreateClient {\n    name: String!\n  }\n\n  input InputWhereClient {\n    id: String!\n  }\n\n  input InputUpdateClient {\n    name: String\n  }\n\n  type Mutation {\n    createClient(data: InputCreateClient): Client\n\n    updateClient(where: InputWhereClient!, data: InputUpdateClient): Client\n\n    deleteClient(where: InputWhereClient!): Client\n  }\n"], ["\n  type Client {\n    id: ID!\n    name: String!\n    projects: [Project]\n    createdAt: DateTime!\n    updatedAt: DateTime!\n  }\n\n  type Query {\n    getClients: [Client]\n    getClient(id: String!): Client\n  }\n\n  input InputCreateClient {\n    name: String!\n  }\n\n  input InputWhereClient {\n    id: String!\n  }\n\n  input InputUpdateClient {\n    name: String\n  }\n\n  type Mutation {\n    createClient(data: InputCreateClient): Client\n\n    updateClient(where: InputWhereClient!, data: InputUpdateClient): Client\n\n    deleteClient(where: InputWhereClient!): Client\n  }\n"])));
exports.ClientTypes = ClientTypes;
var templateObject_1;
