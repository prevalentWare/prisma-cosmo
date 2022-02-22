"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTypes = void 0;
var apollo_server_micro_1 = require("apollo-server-micro");
var RoleTypes = (0, apollo_server_micro_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Role {\n    id: ID!\n    name: Enum_RoleName!\n    users: [User]\n    pages: [Page]\n    createdAt: DateTime!\n    updatedAt: DateTime!\n  }\n\n  type Query {\n    getRoles: [Role]\n    getRole(id: String!): Role\n  }\n\n  input InputCreateRole {\n    name: Enum_RoleName!\n  }\n\n  input InputWhereRole {\n    id: String!\n  }\n\n  input InputUpdateRole {\n    name: Enum_RoleName\n  }\n\n  type Mutation {\n    createRole(data: InputCreateRole): Role\n\n    updateRole(where: InputWhereRole!, data: InputUpdateRole): Role\n\n    deleteRole(where: InputWhereRole!): Role\n  }\n"], ["\n  type Role {\n    id: ID!\n    name: Enum_RoleName!\n    users: [User]\n    pages: [Page]\n    createdAt: DateTime!\n    updatedAt: DateTime!\n  }\n\n  type Query {\n    getRoles: [Role]\n    getRole(id: String!): Role\n  }\n\n  input InputCreateRole {\n    name: Enum_RoleName!\n  }\n\n  input InputWhereRole {\n    id: String!\n  }\n\n  input InputUpdateRole {\n    name: Enum_RoleName\n  }\n\n  type Mutation {\n    createRole(data: InputCreateRole): Role\n\n    updateRole(where: InputWhereRole!, data: InputUpdateRole): Role\n\n    deleteRole(where: InputWhereRole!): Role\n  }\n"])));
exports.RoleTypes = RoleTypes;
var templateObject_1;
