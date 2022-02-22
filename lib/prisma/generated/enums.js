"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GQLEnums = void 0;
var apollo_server_micro_1 = require("apollo-server-micro");
var GQLEnums = (0, apollo_server_micro_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  enum Enum_RoleName {\n    Admin\n    Dev\n  }\n"], ["\n  enum Enum_RoleName {\n    Admin\n    Dev\n  }\n"])));
exports.GQLEnums = GQLEnums;
var templateObject_1;
