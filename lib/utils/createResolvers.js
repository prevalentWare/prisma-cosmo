"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResolvers = void 0;
var capitalize_1 = require("./capitalize");
var writeFile_1 = require("./writeFile");
var path_1 = __importDefault(require("path"));
function betweenMarkers(text, begin, end) {
    var firstChar = text.indexOf(begin) + begin.length;
    var lastChar = text.indexOf(end);
    var newText = text.substring(firstChar, lastChar);
    return newText;
}
var createResolvers = function (model, parsedModels) { return __awaiter(void 0, void 0, void 0, function () {
    var relatedFields, resolverFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                relatedFields = model.fields.filter(function (f) { return f.isRelatedModel; });
                resolverFile = "\n    import prisma from 'config/prisma';\n\n    const ".concat(model.name, "Resolvers = {\n    ").concat(model.name, ": {\n        ").concat(relatedFields
                    .map(function (rf) {
                    if (rf.isArray) {
                        var relatedModel = parsedModels.filter(function (pm) { return pm.name === rf.type; })[0];
                        var relatedModelRelation = relatedModel.fields.filter(function (fld) { return fld.type === model.name; })[0];
                        if (relatedModelRelation.isArray) {
                            return "".concat(rf.name, ": async (parent:any, _:any) => {\n                  return await prisma.").concat((0, capitalize_1.unCapitalize)(relatedModel.name), ".findMany({\n                    where: {\n                      ").concat(relatedModelRelation.name, ": {\n                        some: {\n                          id: {\n                            equals: parent.id,\n                          },\n                        },\n                      },\n                    },\n                  });\n                }");
                        }
                        else {
                            //many to one
                            return "".concat(rf.name, ": async (parent:any, _:any) => {\n                  return await prisma.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findMany({\n                  where: {\n                      ").concat(relatedModel.fields.filter(function (f) { return f.type === model.name; })[0].name, ": {\n                        is: {\n                          id: {\n                            equals: parent.id,\n                          },\n                        },\n                      },\n                    },\n                  })\n                }");
                        }
                    }
                    else if (
                    //one to many
                    rf.attributes.length > 0 &&
                        rf.attributes[0].includes('fields')) {
                        var relatedField = betweenMarkers(rf.attributes[0], 'fields:[', ']');
                        if (rf.required) {
                            return "\n                ".concat(rf.name, ": async (parent:any, _:any) => {\n                return await prisma.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findUnique({\n                    where: {\n                    id: parent.").concat(relatedField, ",\n                    },\n                });\n                }\n                ");
                        }
                        else {
                            return "\n                ".concat(rf.name, ": async (parent:any, _:any) => {\n                  if (parent.").concat(relatedField, ") {\n                    return await prisma.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findUnique({\n                        where: {\n                        id: parent.").concat(relatedField, ",\n                        },\n                    });\n                  }\n                  else{\n                    return null;\n                  }\n                }\n                ");
                        }
                    }
                    else {
                        //one to one
                        if (rf.attributes.length > 0) {
                            var relationName_1 = rf.attributes
                                .filter(function (a) { return a.includes('@relation'); })[0]
                                .split('"')[1];
                            var relatedField_1 = model.fields.filter(function (f) {
                                return f.attributes.filter(function (a) { return a.includes(relationName_1); })
                                    .length > 0;
                            })[0];
                            var relatedModel = parsedModels.filter(function (pm) { return pm.name === relatedField_1.type; })[0];
                            var relatedModelRelation = relatedModel.fields.filter(function (fld) { return fld.type === model.name; })[0];
                            var relationFieldName = betweenMarkers(relatedModelRelation.attributes
                                .filter(function (a) { return a.includes('@relation'); })[0]
                                .split(',')
                                .filter(function (a) { return a.includes('fields'); })[0], 'fields:[', ']');
                            return "".concat(rf.name, ": async (parent:any, _:any) => {\n                  return await prisma.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findUnique({\n                    where:{\n                      ").concat(relationFieldName, ":parent.id\n                    }\n                  })\n                }");
                        }
                        else {
                            return "".concat(rf.name, ": async (parent:any, _:any) => {\n                  return await prisma.").concat((0, capitalize_1.unCapitalize)(rf.type), ".findUnique({\n                    where:{\n                      ").concat((0, capitalize_1.unCapitalize)(model.name), "Id:parent.id\n                    }\n                  })\n                }");
                        }
                    }
                })
                    .join(','), "\n    },\n    Query: {\n        ").concat((0, capitalize_1.unCapitalize)(model.name), "s: async () => {\n        return await prisma.").concat((0, capitalize_1.unCapitalize)(model.name), ".findMany({});\n        },\n        ").concat((0, capitalize_1.unCapitalize)(model.name), ": async (_:any, args:any) => {\n        return await prisma.").concat((0, capitalize_1.unCapitalize)(model.name), ".findUnique({\n            where: {\n            id: args.id,\n            },\n        });\n        },\n    },\n    Mutation:{\n      create").concat(model.name, ":async (_:any, args:any)=>{\n        return await prisma.").concat((0, capitalize_1.unCapitalize)(model.name), ".create({\n          data:{...args.data, ").concat(model.fields
                    .filter(function (rf) {
                    return rf.type === 'DateTime' &&
                        rf.name !== 'createdAt' &&
                        rf.name !== 'updatedAt';
                })
                    .map(function (el) { return "".concat(el.name, ": new Date(args.data.").concat(el.name, ").toISOString()"); })
                    .join(','), " }\n        })\n      },\n      update").concat(model.name, ":async (_:any, args:any)=>{\n        return await prisma.").concat((0, capitalize_1.unCapitalize)(model.name), ".update({\n          where:{\n            id:args.where.id\n          },\n          data:{...args.data, ").concat(model.fields
                    .filter(function (rf) {
                    return rf.type === 'DateTime' &&
                        rf.name !== 'createdAt' &&
                        rf.name !== 'updatedAt';
                })
                    .map(function (el) {
                    return "...(args.data.".concat(el.name, " && {").concat(el.name, ": new Date(args.data.").concat(el.name, ").toISOString()})");
                })
                    .join(','), "}\n        })\n      },\n      delete").concat(model.name, ":async (_:any, args:any)=>{\n        return await prisma.").concat((0, capitalize_1.unCapitalize)(model.name), ".delete({\n          where:{\n            id:args.where.id\n          }\n        })\n      },\n    }\n    },\n\n    export { ").concat(model.name, "Resolvers };\n\n    ");
                return [4 /*yield*/, (0, writeFile_1.writeFile)(path_1.default.join(process.cwd(), "prisma/generated/graphql/".concat(model.name.toLowerCase(), "/resolvers.ts")), resolverFile)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createResolvers = createResolvers;
