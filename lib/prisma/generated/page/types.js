"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageTypes = void 0;
var apollo_server_micro_1 = require("apollo-server-micro");
var PageTypes = (0, apollo_server_micro_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Page {\n    id: ID!\n    name: String!\n    path: String!\n    roles: [Role]\n    createdAt: DateTime!\n    updatedAt: DateTime!\n  }\n\n  type Query {\n    getPages: [Page]\n    getPage(id: String!): Page\n  }\n\n  input InputCreatePage {\n    name: String!\n    path: String!\n  }\n\n  input InputWherePage {\n    id: String!\n  }\n\n  input InputUpdatePage {\n    name: String\n    path: String\n  }\n\n  type Mutation {\n    createPage(data: InputCreatePage): Page\n\n    updatePage(where: InputWherePage!, data: InputUpdatePage): Page\n\n    deletePage(where: InputWherePage!): Page\n  }\n"], ["\n  type Page {\n    id: ID!\n    name: String!\n    path: String!\n    roles: [Role]\n    createdAt: DateTime!\n    updatedAt: DateTime!\n  }\n\n  type Query {\n    getPages: [Page]\n    getPage(id: String!): Page\n  }\n\n  input InputCreatePage {\n    name: String!\n    path: String!\n  }\n\n  input InputWherePage {\n    id: String!\n  }\n\n  input InputUpdatePage {\n    name: String\n    path: String\n  }\n\n  type Mutation {\n    createPage(data: InputCreatePage): Page\n\n    updatePage(where: InputWherePage!, data: InputUpdatePage): Page\n\n    deletePage(where: InputWherePage!): Page\n  }\n"])));
exports.PageTypes = PageTypes;
var templateObject_1;
