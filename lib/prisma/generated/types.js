"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
var apollo_server_micro_1 = require("apollo-server-micro");
var types_1 = require("./client/types");
var types_2 = require("./page/types");
var types_3 = require("./profile/types");
var types_4 = require("./project/types");
var types_5 = require("./report/types");
var types_6 = require("./role/types");
var types_7 = require("./user/types");
var types_8 = require("./test/types");
var enums_1 = require("./enums");
var genericTypes = (0, apollo_server_micro_1.gql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  scalar DateTime\n"], ["\n  scalar DateTime\n"])));
exports.types = [
    genericTypes,
    enums_1.GQLEnums,
    types_1.ClientTypes,
    types_2.PageTypes,
    types_3.ProfileTypes,
    types_4.ProjectTypes,
    types_5.ReportTypes,
    types_6.RoleTypes,
    types_7.UserTypes,
    types_8.TestTypes,
];
var templateObject_1;
