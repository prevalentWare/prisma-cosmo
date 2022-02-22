"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileTypes = void 0;
var apollo_server_micro_1 = require("apollo-server-micro");
var ProfileTypes = (0, apollo_server_micro_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  type Profile {\n    id: ID!\n    phone: String!\n    address: String!\n    user: User!\n    userId: String!\n    createdAt: DateTime!\n    updatedAt: DateTime!\n  }\n\n  type Query {\n    getProfiles: [Profile]\n    getProfile(id: String!): Profile\n  }\n\n  input InputCreateProfile {\n    phone: String!\n    address: String!\n    userId: String!\n  }\n\n  input InputWhereProfile {\n    id: String!\n  }\n\n  input InputUpdateProfile {\n    phone: String\n    address: String\n    userId: String\n  }\n\n  type Mutation {\n    createProfile(data: InputCreateProfile): Profile\n\n    updateProfile(where: InputWhereProfile!, data: InputUpdateProfile): Profile\n\n    deleteProfile(where: InputWhereProfile!): Profile\n  }\n"], ["\n  type Profile {\n    id: ID!\n    phone: String!\n    address: String!\n    user: User!\n    userId: String!\n    createdAt: DateTime!\n    updatedAt: DateTime!\n  }\n\n  type Query {\n    getProfiles: [Profile]\n    getProfile(id: String!): Profile\n  }\n\n  input InputCreateProfile {\n    phone: String!\n    address: String!\n    userId: String!\n  }\n\n  input InputWhereProfile {\n    id: String!\n  }\n\n  input InputUpdateProfile {\n    phone: String\n    address: String\n    userId: String\n  }\n\n  type Mutation {\n    createProfile(data: InputCreateProfile): Profile\n\n    updateProfile(where: InputWhereProfile!, data: InputUpdateProfile): Profile\n\n    deleteProfile(where: InputWhereProfile!): Profile\n  }\n"])));
exports.ProfileTypes = ProfileTypes;
var templateObject_1;
