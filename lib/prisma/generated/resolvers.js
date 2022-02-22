"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
var resolvers_1 = require("./client/resolvers");
var resolvers_2 = require("./page/resolvers");
var resolvers_3 = require("./profile/resolvers");
var resolvers_4 = require("./project/resolvers");
var resolvers_5 = require("./report/resolvers");
var resolvers_6 = require("./role/resolvers");
var resolvers_7 = require("./user/resolvers");
var resolvers_8 = require("./test/resolvers");
exports.resolvers = [
    resolvers_1.ClientResolvers,
    resolvers_2.PageResolvers,
    resolvers_3.ProfileResolvers,
    resolvers_4.ProjectResolvers,
    resolvers_5.ReportResolvers,
    resolvers_6.RoleResolvers,
    resolvers_7.UserResolvers,
    resolvers_8.TestResolvers,
];
