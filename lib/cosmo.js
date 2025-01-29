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
exports.cosmo = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var util_1 = require("util");
var parseModel_1 = require("./utils/parseModel");
var createSchemasFiles_1 = require("./utils/createSchemasFiles");
var generateSchemaObject_1 = require("./utils/generateSchemaObject");
var createModelsFiles_1 = require("./utils/createModelsFiles");
var createBaseResolversFile_1 = require("./utils/createBaseResolversFile");
var createResolversModel_1 = require("./utils/createResolversModel");
var createDirectory_1 = require("./utils/createDirectory");
var createDataLoadersModel_1 = require("./utils/createDataLoadersModel");
var generateTypeObject_1 = require("./utils/generateTypeObject");
var rimraf_1 = __importDefault(require("rimraf"));
var mergeSchemaFiles_1 = require("./utils/mergeSchemaFiles");
var readFile = (0, util_1.promisify)(fs_1.default.readFile);
var rmrf = (0, util_1.promisify)(rimraf_1.default);
var cosmo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var file, models, parsedModels, enums, parsedEnums, gqlSchemas;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // merge schema files
            return [4 /*yield*/, (0, mergeSchemaFiles_1.mergeSchemaFiles)()];
            case 1:
                // merge schema files
                _a.sent();
                return [4 /*yield*/, readFile(path_1.default.join(process.cwd(), 'prisma/schema.prisma'), { encoding: 'utf-8' })];
            case 2:
                file = _a.sent();
                return [4 /*yield*/, rmrf('./prisma/generated')];
            case 3:
                _a.sent();
                (0, createDirectory_1.createDirectory)('./prisma/generated');
                // createDirectory('./prisma/generated/sessionConfig');
                (0, createDirectory_1.createDirectory)('./prisma/generated/models');
                models = file.match(/model([^}]+)}/g);
                parsedModels = models === null || models === void 0 ? void 0 : models.filter(function (el) { return !el.includes('cosmo-ignore'); }).map(function (m) {
                    return (0, parseModel_1.parseModel)(m);
                });
                enums = file.match(/enum([^}]+)}/g);
                parsedEnums = Array.from(file.matchAll(/enum\s+([A-Za-z_][A-Za-z0-9_]*)/g)).map(function (match) { return match[1]; });
                return [4 /*yield*/, (parsedModels === null || parsedModels === void 0 ? void 0 : parsedModels.map(function (model) {
                        return (0, generateSchemaObject_1.generateSchemaObject)(model);
                    }))];
            case 4:
                gqlSchemas = _a.sent();
                // create files resolvers for every model
                return [4 /*yield*/, (0, createModelsFiles_1.createModelsFiles)(gqlSchemas)];
            case 5:
                // create files resolvers for every model
                _a.sent();
                return [4 /*yield*/, (0, createSchemasFiles_1.createSchemasFiles)(gqlSchemas, enums)];
            case 6:
                _a.sent();
                //await createSessionConfig(gqlSchemas, parsedModels);
                // create file containing the types in typescript for every model
                return [4 /*yield*/, (0, generateTypeObject_1.createTypeObject)(parsedModels, parsedEnums)];
            case 7:
                //await createSessionConfig(gqlSchemas, parsedModels);
                // create file containing the types in typescript for every model
                _a.sent();
                // create resolvers
                parsedModels === null || parsedModels === void 0 ? void 0 : parsedModels.map(function (model) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, createResolversModel_1.createResolvers)(model, parsedModels)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                parsedModels === null || parsedModels === void 0 ? void 0 : parsedModels.map(function (model) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, createDataLoadersModel_1.createDataLoaders)(model, parsedModels)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                //create resolver file
                return [4 /*yield*/, (0, createBaseResolversFile_1.createBaseResolversFile)(parsedModels)];
            case 8:
                //create resolver file
                _a.sent();
                // Clean up generated schema if it was created from multiple files
                return [4 /*yield*/, (0, mergeSchemaFiles_1.cleanGeneratedSchema)()];
            case 9:
                // Clean up generated schema if it was created from multiple files
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.cosmo = cosmo;
