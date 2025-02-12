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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var createResolvers = function (model, parsedModels, federated) { return __awaiter(void 0, void 0, void 0, function () {
    var relatedFields, federatedResolver, resolverFile, generalResolverFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                relatedFields = model.fields.filter(function (f) { return f.isRelatedModel; });
                federatedResolver = federated
                    ? "\n      __resolveReference: async (reference: { id: string }, { db }) => {\n        ".concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.loader.clearAll();\n        return await ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.loader.load(reference.id);\n      },\n    ")
                    : '';
                resolverFile = "\n    import { ".concat(model.name, " } from '@prisma/client'\n    import { Resolver } from '@/types';\n    import { ").concat(model.name, "CreateInput, ").concat(model.name, "UpdateInput, ").concat(model.name, "WhereDeleteInput, ").concat(model.name, "WhereUniqueInput } from '../../types';\n    import { ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader } from './dataLoaders';\n \n    const ").concat((0, capitalize_1.unCapitalize)(model.name), "Resolvers: Resolver = {\n    ").concat(model.name, ": {\n        ").concat(federatedResolver, "\n        ").concat(relatedFields
                    .map(function (rf) {
                    if (rf.isArray) {
                        var relatedModel = parsedModels.filter(function (pm) { return pm.name === rf.type; })[0];
                        var relatedModelRelation = relatedModel.fields.filter(function (fld) { return fld.type === model.name; })[0];
                        if (relatedModelRelation.isArray) {
                            return "\n                ".concat(rf.name, ": async (parent: ").concat(model.name, ", _: null, { db, session }) => {\n                    ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.clearAll()\n                    return await ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.load(parent.id);\n                }\n                ");
                        }
                        else {
                            //many to one
                            return "\n                ".concat(rf.name, ": async (parent: ").concat(model.name, ", _: null, { db,session }) => {\n                  ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.clearAll()\n                  return await ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.load(parent.id);\n                }");
                        }
                    }
                    else if (
                    //one to many
                    rf.attributes.length > 0 &&
                        rf.attributes[0].includes('fields')) {
                        var relatedField = betweenMarkers(rf.attributes[0], 'fields:[', ']');
                        return "\n              ".concat(rf.name, ": async (parent: ").concat(model.name, ", _: null, { db,session }) => {\n                if (parent?.").concat(relatedField, ") {\n                  ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.clearAll()   \n                  return await ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.load(parent.").concat(relatedField, ");\n\n                };\n\n                return null;\n              }\n              ");
                    }
                    else {
                        //one to one
                        if (rf.attributes.length > 0) {
                            var relationName_1 = rf.attributes
                                .filter(function (a) { return a.includes('@relation'); })[0]
                                .split('"')[1];
                            var relatedField = model.fields.filter(function (f) {
                                return f.attributes.filter(function (a) { return a.includes(relationName_1); })
                                    .length > 0;
                            })[0];
                            return "".concat(rf.name, ": async (parent: ").concat(model.name, ", _: null, { db, session }) => {\n                  ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.clearAll()   \n                  return await ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.load(parent.").concat(typeof relatedField === 'object' ? 'id' : relatedField, ");\n                }");
                        }
                        else {
                            return "".concat(rf.name, ": async (parent: ").concat(model.name, ", _: null, { db,session }) => {\n                    ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.clearAll()  \n                    return await ").concat((0, capitalize_1.unCapitalize)(model.name), "DataLoader.").concat(rf.name, "Loader.load(parent.id);\n                    }");
                        }
                    }
                })
                    .join(','), "\n    },\n    Query: {\n        ").concat((0, capitalize_1.unCapitalize)(model.name), "s: async (_: null, __: null, { db,session }) => {\n         return await db.").concat((0, capitalize_1.unCapitalize)(model.name), ".findMany({});\n        },\n        ").concat((0, capitalize_1.unCapitalize)(model.name), ": async (_: null, args: ").concat(model.name, "WhereUniqueInput, { db, session }) => {\n          return await db.").concat((0, capitalize_1.unCapitalize)(model.name), ".findUnique({\n              where: {\n              id: args.id,\n              },\n          });\n        },\n    },\n    Mutation:{\n      create").concat(model.name, ":async (_: null, args: ").concat(model.name, "CreateInput, { db,session })=>{\n        return await db.").concat((0, capitalize_1.unCapitalize)(model.name), ".create({\n          data:{...args.data}\n        })\n      },\n      update").concat(model.name, ":async (_: null, args: ").concat(model.name, "UpdateInput, { db, session })=>{\n          return await db.").concat((0, capitalize_1.unCapitalize)(model.name), ".update({\n            where:{\n              id:args.where.id\n            },\n            data:{...args.data}\n          })\n      },\n      delete").concat(model.name, ":async (_: null, args: ").concat(model.name, "WhereDeleteInput, { db, session })=>{\n          return await db.").concat((0, capitalize_1.unCapitalize)(model.name), ".delete({\n            where:{\n              id:args.where.id\n            }\n          })\n      }\n    }\n  }\n  export { ").concat((0, capitalize_1.unCapitalize)(model.name), "Resolvers };\n    ");
                return [4 /*yield*/, (0, writeFile_1.writeFile)(path_1.default.join(process.cwd(), "prisma/generated/models/".concat(model.name.toLowerCase(), "/resolvers.ts")), resolverFile)];
            case 1:
                _a.sent();
                generalResolverFile = "  \n    import { Resolver } from '@/types';\n    import { getSignedUrlForUpload } from '@/utils/getSignedURL';\n    import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';\n    import { getSignedUrl } from '@aws-sdk/s3-request-presigner';\n\n    const generalResolvers: Resolver = {\n      Query: {\n        getSignedUrlForUpload: async (parent, args) => {\n          return await {\n            fileName: args.file,\n            url: getSignedUrlForUpload(args.file),\n          };\n        },\n        getMultipleSignedUrlsForUpload: async (parent, args) => {\n          return await Promise.all(\n            args.files.map(async (file: string) => ({\n              fileName: file,\n              url: await getSignedUrlForUpload(file),\n            }))\n          );\n        },\n      },\n      Mutation: {},\n    };\n    export { generalResolvers };\n";
                (0, writeFile_1.writeFile)(path_1.default.join(process.cwd(), "prisma/generated/models/general/resolvers.ts"), generalResolverFile);
                return [2 /*return*/];
        }
    });
}); };
exports.createResolvers = createResolvers;
